"use client";
import { useEffect, useRef, useState } from "react";
import ToggleSwitch from "./switch"; // Assume it's in the same folder
import Timer from "./timer"; // Timer component for recording duration
import MicrophonePulse from "./microphone";
import { Pause, Play, Square, Download, Eye } from 'lucide-react';
import PreviewModal from "./preview";

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

  // Start video/audio stream based on video toggle
  useEffect(() => {
    async function getMedia() {
      try {
        const constraints = isVideoEnabled
          ? { video: true, audio: true }
          : { audio: true }; // Audio-only if video is disabled

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
        if (videoRef.current && isVideoEnabled) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    getMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isVideoEnabled]);

  const resetTimer = () => {
    setSeconds(0);
  };

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const togglePauseResume = () => {
    if (!isRecording) {
      startRecording(); // Start recording if it's not recording
    } else if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      resetTimer();
    }
  };

  // Handle data availability after stopping recording
  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  // Download recorded video or audio
  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, {
      type: isVideoEnabled ? "video/webm" : "audio/wav",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = isVideoEnabled ? "recording.webm" : "recording.wav";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-600 to-purple-950 flex justify-center items-center">
      <div className="w-full max-w-xl flex flex-col items-center rounded-lg">
        <div className="flex flex-col items-center w-full bg-gray-800 p-8 rounded-lg max-w-lg ">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Session Recording
          </h1>

          {/* Video toggle switch */}
          

          {/* Fixed size gray box */}
          <div className="relative w-full h-96 max-w-lg rounded-lg flex justify-center items-center">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MicrophonePulse isRecording={isRecording} />
            )}
          </div>
          <Timer isRecording={isRecording} isPaused={isPaused} reset={!isRecording} />
          {!isRecording && (
          <ToggleSwitch
            isVideoEnabled={isVideoEnabled}
            setIsVideoEnabled={setIsVideoEnabled}
          />)}


         
          <div className="flex space-x-4 py-4">
            {/* Pause/Play/Start Button */}
            <button
              onClick={togglePauseResume}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none"
            >
              {!isRecording ? (
                <Play size={20} /> // Show Play icon to start recording
              ) : isPaused ? (
                <Play size={20} /> // Show Play icon to resume
              ) : (
                <Pause size={20} /> // Show Pause icon when recording
              )}
            </button>

            {/* Stop Button */}
            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                <Square size={20} />
              </button>
            )}
          </div>


          {recordedChunks.length > 0 ? (
  <div className="flex space-x-4">
    {/* Download Icon Button */}
    <button
      onClick={downloadRecording}
      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none"
    >
      <Download size={20} />
    </button>

    {/* Preview Icon Button */}
    <button
      onClick={() => setShowModal(true)} // Trigger modal
      className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 focus:outline-none"
    >
      <Eye size={20} />
    </button>
  </div>
) : (
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
  >
    Record first
  </button>
)}
<PreviewModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          recordedChunks={recordedChunks}
          isVideoEnabled={isVideoEnabled}
        />
        </div>
          
        
      </div>
    </div>
  );
};

export default WebRTCRecorder;
