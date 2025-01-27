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
 

  useEffect(() => {
    async function getMedia() {
      try {
        const constraints = isVideoEnabled
          ? { video: true, audio: true }
          : { audio: true }; // Audio-only if video is disabled
  
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Stream obtained:", stream);
        setStream(stream);
  
        if (videoRef.current && isVideoEnabled) {
          videoRef.current.srcObject = stream;
          console.log("Video ref updated with stream.");
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
  
  const handleContextSave = (text) => {
    setContext(text);
    setIsContextSaved(true);
    console.log("Context saved:", text);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);
  
  

  const resetTimer = () => {
    setSeconds(0);
  };

  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      console.log("MediaRecorder initialized:", mediaRecorder);
  
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = () => console.log("Recording stopped.");
      mediaRecorder.onerror = (e) => console.error("Recording error:", e);
  
      mediaRecorder.start();
      console.log("Recording started.");
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
        console.log("Recording resumed.");
      } else {
        mediaRecorderRef.current.pause();
        console.log("Recording paused.");
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
      console.log("Data available:", event.data);
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
