from flask import Flask, request, jsonify
import pymongo
from routes.auth_routes import auth_bp  # Import the auth routes
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from utils.audioextraction import extract_audio
from utils.expressions import analyze_video_emotions
from utils.transcription import speech_to_text_long
from utils.vocals import predict_emotion
from utils.vocabulary import evaluate_vocabulary
from groq import Groq
from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import pandas as pd
from bson import ObjectId  # Import ObjectId from bson

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient("")
db = client["Eloquence"]
collections_user = db["user"]
reports_collection = db["reports"]

# Groq client setup
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize the audio emotion model, feature extractor, and id2label mapping
model_id = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
model = AutoModelForAudioClassification.from_pretrained(model_id)
feature_extractor = AutoFeatureExtractor.from_pretrained(model_id, do_normalize=True)
id2label = model.config.id2label

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_keys_to_strings(data):
    """
    Recursively converts all numeric keys in a dictionary to strings.
    """
    if isinstance(data, dict):
        return {str(k): convert_keys_to_strings(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_keys_to_strings(item) for item in data]
    else:
        return data

def convert_objectid_to_string(data):
    """
    Recursively converts all ObjectId fields in a dictionary to strings.
    """
    if isinstance(data, dict):
        return {k: convert_objectid_to_string(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_objectid_to_string(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

def calculate_voice_score(audio_emotion):
    """
    Calculate a score out of 100 based on the emotions predicted from the audio.
    """
    # Example logic: If the dominant emotion is "happy", give a higher score.
    dominant_emotion = max(audio_emotion, key=lambda x: x["emotion"])
    if dominant_emotion["emotion"] == "happy":
        return 90  # High score for positive emotions
    elif dominant_emotion["emotion"] == "neutral":
        return 70  # Moderate score for neutral emotions
    else:
        return 50  # Lower score for negative emotions

def calculate_expressions_score(emotion_analysis):
    """
    Calculate a score out of 100 based on the facial expressions in the video.
    """
    # Example logic: If the dominant emotion is "happy", give a higher score.
    dominant_emotion = emotion_analysis.idxmax(axis=1)[0]
    if dominant_emotion == "happy":
        return 90  # High score for positive emotions
    elif dominant_emotion == "neutral":
        return 70  # Moderate score for neutral emotions
    else:
        return 50  # Lower score for negative emotions

# Register auth routes
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    return "Hello World"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    context = request.form.get('context', '')
    mode = request.form.get('mode', 'video')  # Get the mode (video or audio)

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract audio if in video mode
        if mode == "video":
            audio_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output.wav')
            if not extract_audio(file_path, audio_path):
                return jsonify({"error": "Failed to extract audio"}), 500
        else:
            audio_path = file_path  # Use the uploaded audio file directly

        # Analyze video emotions (only in video mode)
        if mode == "video":
            emotion_analysis = analyze_video_emotions(file_path)
            if emotion_analysis.empty:
                print("No faces detected in the video. Skipping emotion analysis.")
                emotion_analysis = pd.DataFrame({
                    'Human Emotions': ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'],
                    'Emotion Value from the Video': [0] * 7  # Default to zero values
                })
        else:
            emotion_analysis = pd.DataFrame()  # No emotion analysis for audio-only mode

        # Transcribe audio to text
        transcription = speech_to_text_long(audio_path)

        # Predict emotion from audio
        audio_emotion = predict_emotion(audio_path, model, feature_extractor, id2label)

        # Evaluate vocabulary
        vocabulary_report = evaluate_vocabulary(transcription, context)

        # Generate scores
        vocabulary_score = int(vocabulary_report.split("Overall Score: ")[1].split("/")[0])  # Extract score from report
        voice_score = calculate_voice_score(audio_emotion)
        expressions_score = calculate_expressions_score(emotion_analysis) if mode == "video" else 0  # No expression score for audio-only mode

        # Generate reports using Groq API
        speech_report = generate_speech_report(transcription, context, audio_emotion)
        expression_report = generate_expression_report(emotion_analysis) if mode == "video" else "No expression analysis for audio-only mode."

        # Prepare report data
        report_data = {
            "transcription": transcription,
            "context": context,
            "vocabulary_report": vocabulary_report,
            "speech_report": speech_report,
            "expression_report": expression_report,
            "emotion_analysis": emotion_analysis.to_dict() if mode == "video" else {},
            "audio_emotion": audio_emotion,
            "scores": {
                "vocabulary": vocabulary_score,
                "voice": voice_score,
                "expressions": expressions_score
            }
        }

        # Convert numeric keys to strings
        report_data = convert_keys_to_strings(report_data)

        # Save reports to MongoDB
        result = reports_collection.insert_one(report_data)

        # Add the inserted document's ID to the response
        report_data["_id"] = str(result.inserted_id)

        # Convert ObjectId to string in the response
        report_data = convert_objectid_to_string(report_data)

        return jsonify(report_data), 200
    return jsonify({"error": "File type not allowed"}), 400

def generate_speech_report(transcription, context, audio_emotion):
    system_message = f"""
    You are an expert in emotional and contextual analysis of speeches. Based on the context: "{context}", 
    evaluate if the emotions expressed in the audio match the intended purpose. Consider the following emotion data:
    {audio_emotion}.
    """
    user_message = "Provide a short one paragraph report on the emotional appropriateness and a score out of 100."
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content

def generate_expression_report(emotion_analysis):
    system_message = f"""
    You are an expert in emotional analysis of facial expressions. Evaluate the following emotion data:
    {emotion_analysis.to_dict()}.
    """
    user_message = "Provide a short one paragraph report on the emotional appropriateness and a score out of 100."
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content

if __name__ == '__main__':
    app.run(debug=True)
