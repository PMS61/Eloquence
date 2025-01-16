import ffmpeg
import os

def extract_audio(webm_file, output_wav):
    # Check if the input file exists
    if not os.path.isfile(webm_file):
        print(f"Error: File '{webm_file}' does not exist.")
        return

    try:
        # Extract audio using ffmpeg
        (
            ffmpeg
            .input(webm_file)
            .output(output_wav, format='wav', acodec='pcm_s16le')
            .run(quiet=True, overwrite_output=True)
        )
        print(f"Audio successfully extracted to: {output_wav}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Input and output file paths
input_file = "demo.webm"  # Replace with your .webm file path
output_file = "output.wav"  # Replace with your desired .wav file path

# Extract audio
extract_audio(input_file, output_file)
