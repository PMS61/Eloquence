from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import librosa
import torch
import numpy as np

model_id = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
model = AutoModelForAudioClassification.from_pretrained(model_id)
feature_extractor = AutoFeatureExtractor.from_pretrained(model_id, do_normalize=True)
id2label = model.config.id2label

def preprocess_audio(audio_array, feature_extractor, sampling_rate, max_length=3000):
    # Extract mel spectrogram features
    inputs = feature_extractor(
        audio_array,
        sampling_rate=sampling_rate,
        return_tensors="pt",
    )
    

    
    # Access mel spectrogram features (key should match model's output)
    mel_features = inputs["input_features"]
    current_length = mel_features.size(2)

    # Pad or truncate to ensure the length is exactly 3000
    if current_length < max_length:
        pad_size = max_length - current_length
        mel_features = torch.nn.functional.pad(mel_features, (0, pad_size), mode="constant", value=0)
    elif current_length > max_length:
        mel_features = mel_features[:, :, :max_length]

    inputs["input_features"] = mel_features
    return inputs

def predict_emotion(audio_array, model, feature_extractor, id2label, sampling_rate, chunk_duration=8.0):
    chunk_length = int(sampling_rate * chunk_duration)
    num_chunks = len(audio_array) // chunk_length + int(len(audio_array) % chunk_length > 0)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    results = []
    for i in range(num_chunks):
        start = i * chunk_length
        end = min((i + 1) * chunk_length, len(audio_array))
        chunk = audio_array[start:end]

        # Preprocess each chunk
        inputs = preprocess_audio(chunk, feature_extractor, sampling_rate, max_length=3000)
        inputs = {key: value.to(device) for key, value in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        predicted_id = torch.argmax(logits, dim=-1).item()
        predicted_label = id2label[predicted_id]
        
        results.append((i + 1, predicted_label))  # Store chunk index and emotion

    return results


