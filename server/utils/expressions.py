from fer import Video
from fer import FER
import pandas as pd

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

    # Check if any faces were detected
    if not processing_data:
        print("No faces detected in the video.")
        return pd.DataFrame()  # Return an empty DataFrame if no faces are detected

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