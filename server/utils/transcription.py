import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import soundfile as sf
import os

model_name = "openai/whisper-base"
processor = WhisperProcessor.from_pretrained(model_name)
model = WhisperForConditionalGeneration.from_pretrained(model_name)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = model.to(device)

def preprocess_audio(input_audio_path, output_audio_path):
    """
    Converts audio to 16kHz WAV format.

    Args:
        input_audio_path (str): Path to the input audio file.
        output_audio_path (str): Path to save the processed audio file.

    Returns:
        str: Path to the processed audio file.
    """
    audio = AudioSegment.from_file(input_audio_path)
    audio = audio.set_frame_rate(16000).set_channels(1)
    audio.export(output_audio_path, format="wav")
    return output_audio_path

def split_audio(audio_path, chunk_length_ms=30000):
    """
    Splits audio into chunks of specified length.

    Args:
        audio_path (str): Path to the audio file.
        chunk_length_ms (int): Length of each chunk in milliseconds.

    Returns:
        list: List of audio chunks.
    """
    audio = AudioSegment.from_file(audio_path)
    chunks = [audio[i : i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]
    return chunks

def transcribe_chunk(audio_chunk, chunk_index):
    """
    Transcribes a single audio chunk.

    Args:
        audio_chunk (AudioSegment): The audio chunk to transcribe.
        chunk_index (int): Index of the chunk.

    Returns:
        str: Transcription of the chunk.
    """
    temp_path = f"temp_chunk_{chunk_index}.wav"
    audio_chunk.export(temp_path, format="wav")
    audio, sampling_rate = sf.read(temp_path)
    inputs = processor(audio, sampling_rate=16000, return_tensors="pt")
    input_features = inputs.input_features.to(device)
    predicted_ids = model.generate(input_features)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    os.remove(temp_path)  # Clean up temporary file
    return transcription

def speech_to_text_long(audio_path):
    """
    Transcribes a long audio file by splitting it into chunks.

    Args:
        audio_path (str): Path to the audio file.

    Returns:
        str: Full transcription of the audio.
    """
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