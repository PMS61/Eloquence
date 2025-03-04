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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const WebRTCRecorder = () => {
  const router = useRouter();
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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null); // New state for uploaded file URL
  const [title, setTitle] = useState("");

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

  const handleContextSave = ({ title, text }) => {
    setContext(text);
    setTitle(title);
    setIsContextSaved(true);
  };

  const resetTimer = () => {
    setSeconds(0);
  };

  const startRecording = () => {
    if (stream) {
      const options = { mimeType: "video/mp4" };
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
      type: isVideoEnabled ? "video/mp4" : "audio/wav",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = isVideoEnabled ? "recording.mp4" : "recording.wav";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        (isVideoEnabled && file.type === "video/mp4") ||
        (!isVideoEnabled && file.type === "audio/wav")
      ) {
        setUploadedFile(file);
        setUploadedFileUrl(URL.createObjectURL(file)); // Generate URL for preview
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

    toast.info(
      <div>
        <p>Report will be processed in some time.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
      }
    );

    const formData = new FormData();

    if (uploadedFile) {
      formData.append("file", uploadedFile);
    } else {
      const blob = new Blob(recordedChunks, {
        type: isVideoEnabled ? "video/mp4" : "audio/wav",
      });
      formData.append("file", blob, isVideoEnabled ? "recording.mp4" : "recording.wav");
    }

    formData.append("context", context);
    formData.append("title", title);
    formData.append("mode", isVideoEnabled ? "video" : "audio");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
    formData.append("userId", userId);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setReport(data);

      toast.success(
        <div>
          <p>Report is generated.</p>
          <button
            onClick={() =>
              router.push({
                pathname: "/report",
                query: { report: JSON.stringify(data) },
              })
            }
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            View Report
          </button>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen max-h-full bg-[#0F172A]">
      <ToastContainer />
      <div className="w-16 md:w-28">
        <Sidebar />
      </div>
      <div className="flex-1 p-4">
        <div className="h-full flex flex-col bg-[#1E293B] rounded-lg border border-[#334155] shadow-lg">
          <h1 className="text-3xl font-semibold text-center text-[#C9CBD0] py-4">
            Session Recording
          </h1>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            {/* Video or Microphone */}
            <div className="w-full h-[60vh] flex justify-center items-center">
              {isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain rounded-lg border-4 border-[#3ABDF8]"
                />
              ) : (
                <MicrophonePulse isRecording={isRecording} />
              )}
            </div>

            {/* Controls Section */}
            <div className="w-full max-w-2xl flex flex-col items-center space-y-4 mt-4">
              {/* Timer */}
              <Timer
                isRecording={isRecording}
                isPaused={isPaused}
                reset={!isRecording}
              />

              {/* Toggle and Context Button */}
              {!isRecording && (
                <div className="flex space-x-4">
                  <ToggleSwitch
                    isVideoEnabled={isVideoEnabled}
                    setIsVideoEnabled={setIsVideoEnabled}
                  />
                  <button
                    onClick={() => setShowContextDialog(true)}
                    className="bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                  >
                    {isContextSaved ? <Pencil size={24} /> : <Plus size={24} />}
                  </button>
                </div>
              )}

              {/* Recording Controls */}
              <div className="flex space-x-4">
                <button
                  onClick={togglePauseResume}
                  className="bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
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
                    className="bg-gradient-to-r from-[#FB7085] to-[#FFA07A] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                  >
                    <Square size={20} />
                  </button>
                )}
                {(recordedChunks.length > 0 || uploadedFile) && (
                  <>
                    <button
                      onClick={downloadRecording}
                      className="bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white p-2 rounded-lg hover:opacity-90 transition-all"
                    >
                      <Download size={20} />
                    </button>
                    <button
                      onClick={() => setShowModal(true)}
                      className="bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white p-2 rounded-lg hover:opacity-90 transition-all"
                    >
                      <Eye size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* File Upload and Upload Button */}
              <div className="flex items-center justify-center space-x-4 w-full">
                <label className="bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept={isVideoEnabled ? "video/mp4" : "audio/wav"}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={uploadRecording}
                  className="bg-gradient-to-r from-[#3ABDF8] to-[#818CF8] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all w-full max-w-xs"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
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
        uploadedFileUrl={uploadedFileUrl} // Pass the uploaded file URL
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