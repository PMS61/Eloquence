"use client";
import { useEffect, useRef, useState } from "react";
import ToggleSwitch from "./switch"; // Assume it's in the same folder
import Timer from "./timer"; // Timer component for recording duration
import MicrophonePulse from "./microphone";
import { Pause, Play, Square, Download, Eye, Plus, Pencil } from "lucide-react";
import PreviewModal from "./preview";
import Sidebar from "../components/Sidebar";
import "../components/bg.css";
import ContextDialog from "./context";

const WebRTCRecorder = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showContextDialog, setShowContextDialog] = useState(false);
  const [context, setContext] = useState("");
  const [isContextSaved, setIsContextSaved] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); // State for audio-only blob

  useEffect(() => {
    async function getMedia() {
      try {
        const constraints = isVideoEnabled
          ? { video: true, audio: true }
          : { audio: true };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);

        if (videoRef.current && isVideoEnabled) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoEnabled]);

  const resetTimer = () => {
    setSeconds(0);
  };

  const handleContextSave = (text) => {
    setContext(text);
    setIsContextSaved(true);
    console.log("Context saved:", text);
  };

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = () => console.log("Recording stopped.");
      mediaRecorder.onerror = (e) => console.error("Recording error:", e);

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } else {
      console.error("Stream is not initialized.");
    }
  };

  const togglePauseResume = () => {
    if (!isRecording) {
      startRecording();
    } else if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      resetTimer();
  
      // Extract audio from video Blob
      mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
  
        // Extract audio using Web Audio API
        const audioContext = new AudioContext();
        const arrayBuffer = await videoBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Convert audio buffer to WAV format
        const wavBlob = audioBufferToWav(audioBuffer);
        setAudioBlob(wavBlob);
      };
    }
  };
  
  // Helper function to convert audio buffer to WAV format
  const audioBufferToWav = (audioBuffer) => {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length * numOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
  
    // Write WAV headers
    writeWavHeader(view, audioBuffer.length, sampleRate, numOfChannels);
  
    // Write interleaved audio data
    let offset = 44;
    const channels = [];
    for (let i = 0; i < numOfChannels; i++) {
      channels.push(audioBuffer.getChannelData(i));
    }
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }
  
    return new Blob([buffer], { type: "audio/wav" });
  };
  
  const writeWavHeader = (view, dataLength, sampleRate, numChannels) => {
    const blockAlign = numChannels * 2;
    const byteRate = sampleRate * blockAlign;
  
    view.setUint32(0, 0x46464952, false); // "RIFF"
    view.setUint32(4, 36 + dataLength * numChannels * 2, true); // File size
    view.setUint32(8, 0x45564157, false); // "WAVE"
    view.setUint32(12, 0x20746d66, false); // "fmt "
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    view.setUint32(36, 0x61746164, false); // "data"
    view.setUint32(40, dataLength * numChannels * 2, true); // Subchunk2Size
  };
  
  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, {
      type: isVideoEnabled ? "video/webm" : "audio/wav",
    });

    // Save the original recording
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = isVideoEnabled ? "recording.webm" : "recording.wav";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    // If it's a video, save the audio-only version
    if (isVideoEnabled) {
      extractAudio(blob);
    }
  };

  const extractAudio = (videoBlob) => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(videoBlob);
    videoElement.muted = true;

    videoElement.onloadedmetadata = async () => {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(videoElement);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      const audioRecorder = new MediaRecorder(destination.stream);

      let audioChunks = [];
      audioRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioAnchor = document.createElement("a");
        audioAnchor.style.display = "none";
        audioAnchor.href = audioUrl;
        audioAnchor.download = "audio-only.wav";
        document.body.appendChild(audioAnchor);
        audioAnchor.click();
        URL.revokeObjectURL(audioUrl);
      };

      audioRecorder.start();
      videoElement.play();
      setTimeout(() => {
        audioRecorder.stop();
        videoElement.pause();
      }, videoElement.duration * 1000);
    };
  };

  return (
    <div className="flex static-bg min-h-screen max-h-full">
      <div className="w-16 md:w-28">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <div className="h-full flex flex-col glass-bg">
          <h1 className="text-3xl font-semibold text-center text-white py-2">
            Session Recording
          </h1>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-full h-[60vh] flex justify-center items-center">
              {isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain rounded-lg transform scale-x-[-1]"
                />
              ) : (
                <MicrophonePulse isRecording={isRecording} />
              )}
            </div>
            <div className="flex flex-col items-center space-y-2 mt-2">
              <Timer
                isRecording={isRecording}
                isPaused={isPaused}
                reset={!isRecording}
              />
              {!isRecording && (
                <div className="flex space-x-4">
                  <ToggleSwitch
                    isVideoEnabled={isVideoEnabled}
                    setIsVideoEnabled={setIsVideoEnabled}
                  />
                  <button
                    onClick={() => setShowContextDialog(true)}
                    className="bg-purple-500 text-white px-4 rounded-lg hover:bg-purple-600"
                  >
                    {isContextSaved ? <Pencil size={32} /> : <Plus size={32} />}
                  </button>
                </div>
              )}
              <div className="flex space-x-4 py-2">
                <button
                  onClick={togglePauseResume}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none"
                >
                  {!isRecording ? (
                    <Play size={20} />
                  ) : isPaused ? (
                    <Play size={20} />
                  ) : (
                    <Pause size={20} />
                  )}
                </button>
                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    <Square size={20} />
                  </button>
                )}
                {recordedChunks.length > 0 && (
                  <>
                    <button
                      onClick={downloadRecording}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 focus:outline-none"
                    >
                      <Eye size={20} />
                    </button>


                  </>
                )}
                                    {audioBlob && (
  <button
    onClick={() => {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "audio.wav";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }}
    className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
  >
    <Download size={20} />
  </button>
)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PreviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recordedChunks={recordedChunks}
        isVideoEnabled={isVideoEnabled}
      />
      <ContextDialog
        isOpen={showContextDialog}
        onClose={() => setShowContextDialog(false)}
        onSave={handleContextSave}
        initialContext={context}
      />
    </div>
  );
};

export default WebRTCRecorder;
