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
import json

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://pmsankheb23:KnjSAJM9oB1OMtud@eloquence.yal88.mongodb.net/")
db = client["Eloquence"]
collections_user = db["user"]
reports_collection = db["reports"]
overall_reports_collection = db["overall_reports"]  # New collection for overall reports

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
    title = request.form.get('title', 'Untitled Session')  # Get title from the request
    mode = request.form.get('mode', 'video')
    user_id = request.form.get('userId')  # Get userId from the request

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400  # Ensure userId is present

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

        # Generate scores using LLM
        scores = generate_scores(transcription, audio_emotion, emotion_analysis)

        # Generate reports using Groq API
        speech_report = generate_speech_report(transcription, context, audio_emotion)
        expression_report = generate_expression_report(emotion_analysis) if mode == "video" else "No expression analysis for audio-only mode."

        # Prepare report data
        report_data = {
            "userId": user_id,  # Include user_id in the report
            "title": title,  # Include title in the report
            "context": context,
            "transcription": transcription,
            "vocabulary_report": vocabulary_report,
            "speech_report": speech_report,
            "expression_report": expression_report,
            "scores": scores  # Include scores in the report
        }

        # Save reports to MongoDB
        result = reports_collection.insert_one(report_data)

        # Add the inserted document's ID to the response
        report_data["_id"] = str(result.inserted_id)

        # Update the overall_reports collection
        update_overall_reports(user_id)

        # Convert ObjectId to string for JSON serialization
        report_data = convert_objectid_to_string(report_data)

        return jsonify(report_data), 200
    return jsonify({"error": "File type not allowed"}), 400

def update_overall_reports(user_id):
    """
    Recalculate and update the overall reports and scores for a user.
    """
    # Fetch all reports for the user
    user_reports = list(reports_collection.find({"userId": user_id}))

    if not user_reports:
        return

    # Calculate average scores
    total_vocabulary = 0
    total_voice = 0
    total_expressions = 0
    for report in user_reports:
        total_vocabulary += report["scores"]["vocabulary"]
        total_voice += report["scores"]["voice"]
        total_expressions += report["scores"]["expressions"]

    avg_vocabulary = total_vocabulary / len(user_reports)
    avg_voice = total_voice / len(user_reports)
    avg_expressions = total_expressions / len(user_reports)

    # Generate overall reports for each category using LLM
    overall_reports = generate_overall_reports(user_reports)

    # Prepare data to store in overall_reports collection
    overall_report_data = {
        "userId": user_id,
        "avg_vocabulary": avg_vocabulary,
        "avg_voice": avg_voice,
        "avg_expressions": avg_expressions,
        "overall_reports": overall_reports  # Include the generated overall reports
    }

    # Save or update the overall report in the overall_reports collection
    overall_reports_collection.update_one(
        {"userId": user_id},
        {"$set": overall_report_data},
        upsert=True  # Create a new document if it doesn't exist
    )

@app.route('/user-reports-list', methods=['GET'])
def get_user_reports_list():
    user_id = request.args.get('userId')  # Get userId from query parameters
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Fetch all reports for the user
    user_reports = list(reports_collection.find({"userId": user_id}))

    if not user_reports:
        return jsonify({"error": "No reports found for the user"}), 404

    # Convert ObjectId to string for JSON serialization
    user_reports = convert_objectid_to_string(user_reports)

    return jsonify(user_reports), 200


@app.route('/user-reports', methods=['GET'])
def get_user_reports():
    user_id = request.args.get('userId')  # Get userId from query parameters
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Fetch the overall report for the user
    overall_report = overall_reports_collection.find_one({"userId": user_id})

    if not overall_report:
        return jsonify({"error": "No overall report found for the user"}), 404

    # Convert ObjectId to string for JSON serialization
    overall_report = convert_objectid_to_string(overall_report)

    return jsonify(overall_report), 200

def generate_overall_reports(user_reports):
    """
    Generate three separate overall reports for Voice, Expressions, and Vocabulary.
    """
    # Generate Voice Report
    voice_system_message = """
    You are an expert in speech analysis. Based on the provided reports, generate an overall report summarizing the user's performance in terms of Voice (emotional tone, clarity, and expressiveness).
    """
    voice_user_message = f"""
    Reports: {json.dumps(user_reports, indent=2)}
    Provide a short one paragraph report summarizing the user's overall performance in Voice. Focus on:
    - Emotional tone: Does the tone match the context and intended message?
    - Clarity: Is the speech clear and easy to understand?
    - Expressiveness: Does the speaker effectively convey emotions through their voice?
    - Do not include any scores in the report.
    """
    voice_report = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": voice_system_message},
            {"role": "user", "content": voice_user_message},
        ],
        model="llama-3.3-70b-versatile",
    ).choices[0].message.content

    # Generate Expressions Report
    expressions_system_message = """
    You are an expert in facial expression analysis. Based on the provided reports, generate an overall report summarizing the user's performance in terms of Facial Expressions (emotional appropriateness and expressiveness).
    """
    expressions_user_message = f"""
    Reports: {json.dumps(user_reports, indent=2)}
    Provide a short one paragraph report summarizing the user's overall performance in Facial Expressions. Focus on:
    - Emotional appropriateness: Do the facial expressions match the context and intended message?
    - Expressiveness: Are the facial expressions dynamic and engaging?
    - Consistency: Are the facial expressions consistent with the tone of the speech?
    - Do not include any scores in the report.
    """
    expressions_report = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": expressions_system_message},
            {"role": "user", "content": expressions_user_message},
        ],
        model="llama-3.3-70b-versatile",
    ).choices[0].message.content

    # Generate Vocabulary Report
    vocabulary_system_message = """
    You are an expert in language and vocabulary analysis. Based on the provided reports, generate an overall report summarizing the user's performance in terms of Vocabulary (richness, relevance, and clarity of words).
    """
    vocabulary_user_message = f"""
    Reports: {json.dumps(user_reports, indent=2)}
    Provide a short one paragraph report summarizing the user's overall performance in Vocabulary. Focus on:
    - Richness: Does the user use a varied and engaging vocabulary?
    - Relevance: Are the words used appropriate for the context?
    - Clarity: Are the words clear and easy to understand?
    - Do not include any scores in the report.
    """
    vocabulary_report = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": vocabulary_system_message},
            {"role": "user", "content": vocabulary_user_message},
        ],
        model="llama-3.3-70b-versatile",
    ).choices[0].message.content

    return {
        "voice_report": voice_report,
        "expressions_report": expressions_report,
        "vocabulary_report": vocabulary_report,
    }

def generate_scores(transcription, audio_emotion, emotion_analysis):
    """
    Generate scores for Vocabulary, Voice, and Expressions using the LLM.
    """
    system_message = """
    You are an expert in speech analysis. Based on the provided transcription, audio emotion data, 
    and facial emotion analysis, generate scores (out of 100) for the following categories:
    - Vocabulary: Measures the richness and relevance of words.
    - Voice: Assesses the expressiveness and emotional impact of vocal tone.
    - Expressions: Evaluates the appropriateness of facial expressions.

    Provide only the three scores in JSON format, like:
    {"vocabulary": 85, "voice": 78, "expressions": 90}
    """

    user_message = f"""
    Transcription: {transcription}

    Audio Emotion Data: {audio_emotion}

    Facial Emotion Analysis: {emotion_analysis.to_string(index=False) if not emotion_analysis.empty else "No facial data"}

    Provide only the JSON output with numeric scores.
    """

    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        model="llama-3.3-70b-versatile",
    )

    try:
        # Extract JSON response from LLM output
        scores = json.loads(chat_completion.choices[0].message.content)
        return scores
    except json.JSONDecodeError:
        return {"vocabulary": 0, "voice": 0, "expressions": 0}  # Default in case of failure

def generate_speech_report(transcription, context, audio_emotion):
    system_message = f"""
    You are an expert in emotional and contextual analysis of speeches. Based on the context: "{context}", 
    evaluate if the emotions expressed in the audio match the intended purpose. Consider the following emotion data:
    {audio_emotion}.
    """
    user_message = """
    Provide a short one paragraph report on the emotional appropriateness of the speech. Focus on:
    - Emotional tone: Does the tone match the context and intended message?
    - Clarity: Is the speech clear and easy to understand?
    - Expressiveness: Does the speaker effectively convey emotions through their voice?
    - Do not include any scores in the report.
    """
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        model="llama-3.3-70b-versatile",
    )
    print(chat_completion.choices[0].message.content)
    return chat_completion.choices[0].message.content

def generate_expression_report(emotion_analysis_str):
    """
    Generate a report based on the emotion analysis data.
    """
    system_message = f"""
    You are an expert in emotional analysis of facial expressions. Evaluate the following emotion data:
    {emotion_analysis_str}.
    """
    user_message = """
    Provide a short one paragraph report on the emotional appropriateness of the facial expressions. Focus on:
    - Emotional appropriateness: Do the facial expressions match the context and intended message?
    - Expressiveness: Are the facial expressions dynamic and engaging?
    - Consistency: Are the facial expressions consistent with the tone of the speech?
    - Do not include any scores in the report.
    """
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        model="llama-3.3-70b-versatile",
    )
    print(chat_completion.choices[0].message.content)
    return chat_completion.choices[0].message.content

if __name__ == '__main__':
    app.run(debug=True)