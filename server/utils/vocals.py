from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import librosa
import torch
import numpy as np

model_id = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
model = AutoModelForAudioClassification.from_pretrained(model_id)
feature_extractor = AutoFeatureExtractor.from_pretrained(model_id, do_normalize=True)
id2label = model.config.id2label

def preprocess_audio(audio_array, feature_extractor, sampling_rate, max_length=3000):
    """
    Preprocesses audio for emotion prediction.

    Args:
        audio_array (np.array): The audio data as a numpy array.
        feature_extractor: The feature extractor for the model.
        sampling_rate (int): The sampling rate of the audio.
        max_length (int): Maximum length of the audio features.

    Returns:
        dict: Preprocessed inputs for the model.
    """
    inputs = feature_extractor(
        audio_array,
        sampling_rate=sampling_rate,
        return_tensors="pt",
    )
    mel_features = inputs["input_features"]
    current_length = mel_features.size(2)

    if current_length < max_length:
        pad_size = max_length - current_length
        mel_features = torch.nn.functional.pad(mel_features, (0, pad_size), mode="constant", value=0)
    elif current_length > max_length:
        mel_features = mel_features[:, :, :max_length]

    inputs["input_features"] = mel_features
    return inputs

def predict_emotion(audio_path, model, feature_extractor, id2label, sampling_rate=16000, chunk_duration=8.0):
    """
    Predicts emotions from an audio file.

    Args:
        audio_path (str): Path to the audio file.
        model: The emotion prediction model.
        feature_extractor: The feature extractor for the model.
        id2label (dict): Mapping from label IDs to emotion names.
        sampling_rate (int): The sampling rate of the audio.
        chunk_duration (float): Duration of each chunk in seconds.

    Returns:
        list: List of dictionaries containing emotion predictions for each chunk.
    """
    audio_array, _ = librosa.load(audio_path, sr=sampling_rate)
    chunk_length = int(sampling_rate * chunk_duration)
    num_chunks = len(audio_array) // chunk_length + int(len(audio_array) % chunk_length > 0)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    results = []
    for i in range(num_chunks):
        start = i * chunk_length
        end = min((i + 1) * chunk_length, len(audio_array))
        chunk = audio_array[start:end]

        start_time = round(start / sampling_rate, 2)
        end_time = round(end / sampling_rate, 2)

        inputs = preprocess_audio(chunk, feature_extractor, sampling_rate, max_length=3000)
        inputs = {key: value.to(device) for key, value in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        predicted_id = torch.argmax(logits, dim=-1).item()
        predicted_label = id2label[predicted_id]
        
        results.append({"chunk": i + 1, "start_time": start_time, "end_time": end_time, "emotion": predicted_label})

    return results