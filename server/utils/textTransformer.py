import os
import random
import kagglehub
import speech_recognition as sr

# Function to download the dataset
# def download_and_prepare_dataset():
#     # Download the dataset
#     # print("success1")
#     path = kagglehub.dataset_download("mathurinache/the-lj-speech-dataset")
#     print("Dataset downloaded. Path to files:", path)
#     return path

# Function to convert .wav audio to text
def audio_to_text(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)  # Get audio data from the file
    text = recognizer.recognize_google(audio_data)  # Pass the audio data to the recognizer
    return text

