import torch
from transformers import Speech2TextProcessor, Speech2TextForConditionalGeneration
import librosa
import numpy as np


# Load model and processor
model = Speech2TextForConditionalGeneration.from_pretrained("facebook/s2t-small-librispeech-asr")
processor = Speech2TextProcessor.from_pretrained("facebook/s2t-small-librispeech-asr")

def transcribe_wav(file_path):
    # Load the audio file using librosa
    audio, sampling_rate = librosa.load(file_path, sr=16000)

    # Process the audio to match the input requirements of the model
    inputs = processor(audio, sampling_rate=sampling_rate, return_tensors="pt")
    input_features = inputs.input_features

    # Generate transcription
    generated_ids = model.generate(inputs=input_features)
    transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    return transcription

print(transcribe_wav("LJ001-0005.wav"))