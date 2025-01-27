import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import soundfile as sf
import os

# Load Whisper model and processor
model_name = "openai/whisper-base"
processor = WhisperProcessor.from_pretrained(model_name)
model = WhisperForConditionalGeneration.from_pretrained(model_name)

# Ensure you're using a GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

# Function to convert audio to 16kHz WAV format
def preprocess_audio(input_audio_path, output_audio_path):
    audio = AudioSegment.from_file(input_audio_path)
    audio = audio.set_frame_rate(16000).set_channels(1)
    audio.export(output_audio_path, format="wav")
    return output_audio_path

# Function to split audio into chunks
def split_audio(audio_path, chunk_length_ms=30000):
    audio = AudioSegment.from_file(audio_path)
    chunks = [audio[i : i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]
    return chunks

# Function to process and transcribe each chunk
def transcribe_chunk(audio_chunk, chunk_index):
    temp_path = f"temp_chunk_{chunk_index}.wav"
    audio_chunk.export(temp_path, format="wav")
    audio, sampling_rate = sf.read(temp_path)
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
    input_features = inputs.input_features.to(device)
    predicted_ids = model.generate(input_features)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    os.remove(temp_path)  # Clean up temporary file
    return transcription

# Function to perform speech-to-text for long audio
def speech_to_text_long(audio_path):
    processed_audio_path = "processed_audio.wav"
    preprocess_audio(audio_path, processed_audio_path)

    # Split audio into chunks
    chunks = split_audio(processed_audio_path, chunk_length_ms=30000)  # 30 seconds per chunk
    transcriptions = []

    for idx, chunk in enumerate(chunks):
        print(f"Transcribing chunk {idx + 1} of {len(chunks)}...")
        transcription = transcribe_chunk(chunk, idx)
        transcriptions.append(transcription)

    return " ".join(transcriptions)

# Main function
def main():
    # Provide the path to your audio file
    input_audio_path = "test.wav"  # Replace with your audio file

    if not os.path.exists(input_audio_path):
        print(f"Error: File {input_audio_path} does not exist.")
        return

    try:
        transcription = speech_to_text_long(input_audio_path)
        print("Full Transcription:\n", transcription)
    except Exception as e:
        print("Error during transcription:", str(e))

if __name__ == "__main__":
    main()
