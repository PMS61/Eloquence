"use client";
import { useEffect, useRef, useState } from "react";
import ToggleSwitch from "./switch";
import Timer from "./timer";
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
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // State for uploaded file

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

  const handleContextSave = (text) => {
    setContext(text);
    setIsContextSaved(true);
  };

  const resetTimer = () => {
    setSeconds(0);
  };

  const startRecording = () => {
    if (stream) {
      const options = { mimeType: "video/mp4" }; // Set MIME type to MP4
      const mediaRecorder = new MediaRecorder(stream, options);
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
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, {
      type: isVideoEnabled ? "video/mp4" : "audio/wav", // Use MP4 for video
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = isVideoEnabled ? "recording.mp4" : "recording.wav"; // Save as MP4
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type based on mode
      if (
        (isVideoEnabled && file.type === "video/mp4") ||
        (!isVideoEnabled && file.type === "audio/wav")
      ) {
        setUploadedFile(file);
      } else {
        alert(
          `Invalid file type. Please upload a ${
            isVideoEnabled ? "video/mp4" : "audio/wav"
          } file.`
        );
      }
    }
  };

  const uploadRecording = async () => {
    if (!uploadedFile && recordedChunks.length === 0) {
      alert("No recording or file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (uploadedFile) {
      // Use the uploaded file
      formData.append("file", uploadedFile);
    } else {
      // Use the recorded chunks
      const blob = new Blob(recordedChunks, {
        type: isVideoEnabled ? "video/mp4" : "audio/wav",
      });
      formData.append("file", blob, isVideoEnabled ? "recording.mp4" : "recording.wav");
    }

    formData.append("context", context);
    formData.append("mode", isVideoEnabled ? "video" : "audio");

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
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
              {/* File Upload Input */}
              <input
                type="file"
                accept={isVideoEnabled ? "video/mp4" : "audio/wav"}
                onChange={handleFileUpload}
                className="mt-4"
              />
              <button
                onClick={uploadRecording}
                className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
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
      {report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold">Report</h2>
            <pre>{JSON.stringify(report, null, 2)}</pre>
            <button
              onClick={() => setReport(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebRTCRecorder;