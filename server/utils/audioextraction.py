import ffmpeg
import os

def extract_audio(video_file, output_wav):
    """
    Extracts audio from a video file and saves it as a WAV file.

    Args:
        video_file (str): Path to the input video file (e.g., .mp4).
        output_wav (str): Path to save the extracted audio file.

    Returns:
        bool: True if extraction is successful, False otherwise.
    """
    if not os.path.isfile(video_file):
        print(f"Error: File '{video_file}' does not exist.")
        return False

    try:
        (
            ffmpeg
            .input(video_file)
            .output(output_wav, format='wav', acodec='pcm_s16le')
            .run(quiet=True, overwrite_output=True)
        )
        print(f"Audio successfully extracted to: {output_wav}")
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False