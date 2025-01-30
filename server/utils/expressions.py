from fer import Video
from fer import FER
import os
import pandas as pd
from groq import Groq

def analyze_video_emotions(video_file_path):
    """
    Analyzes the emotions in a given video file and returns a dataframe of scores.

    Args:
        video_file_path (str): Path to the video file to be analyzed.

    Returns:
        pd.DataFrame: DataFrame containing the emotion scores.
    """
    # Initialize the face detector
    face_detector = FER(mtcnn=True)

    # Input the video for processing
    input_video = Video(video_file_path)

    # Analyze the video
    processing_data = input_video.analyze(face_detector, display=False)

    # Convert the results to a DataFrame
    vid_df = input_video.to_pandas(processing_data)
    vid_df = input_video.get_first_face(vid_df)
    vid_df = input_video.get_emotions(vid_df)

    # Calculate the sum of each emotion
    emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
    emotions_values = [sum(vid_df[emotion]) for emotion in emotions]

    # Create a DataFrame for comparison
    score_comparisons = pd.DataFrame({
        'Human Emotions': [emotion.capitalize() for emotion in emotions],
        'Emotion Value from the Video': emotions_values
    })

    return score_comparisons

# # Usage example
# location_videofile = "testvideo.mp4"
# score_comparisons = analyze_video_emotions(location_videofile)

# # Print the emotion scores DataFrame
# print(score_comparisons)

# # Continue with the Groq API processing
# client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
# speech_context = "This is a motivational speech delivered to inspire a team of professionals to overcome challenges and stay optimistic."

# system_message = f"""
# You are an expert in emotional and contextual analysis of speeches. Based on the context: "{speech_context}", 
# evaluate if the emotions expressed in the video match the intended purpose.Do not mention the specific values of the data in your analysis. Consider the following emotion data:
# {score_comparisons.to_dict()}.
# """

# user_message = "Provide a short one paragraph report on the emotional appropriateness and a score out of 100."

# chat_completion = client.chat.completions.create(
#     messages=[
#         {"role": "system", "content": system_message},
#         {"role": "user", "content": user_message},
#     ],
#     model="llama-3.3-70b-versatile",
# )

# print(chat_completion.choices[0].message.content)