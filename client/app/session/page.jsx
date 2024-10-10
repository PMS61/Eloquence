"use client";
import { useEffect, useRef, useState } from "react";
import { Video,Mic } from "lucide-react";

const WebRTCRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true); // Toggle for video/audio selection
  const [audienceCount, setAudienceCount] = useState(1); // Audience selection

  // Start video/audio stream based on the toggle (isVideoEnabled)
  useEffect(() => {
    async function getMedia() {
      try {
        const constraints = isVideoEnabled
          ? { video: true, audio: true } // Video and Audio
          : { audio: true }; // Audio-only
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    getMedia();

    // Stop stream tracks when unmounting
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isVideoEnabled]);

  // Start recording
  const startRecording = () => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
    const blobType = isVideoEnabled ? "video/webm" : "audio/wav";
    const blob = new Blob(recordedChunks, { type: blobType });
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
    <div className="flex flex-col items-center space-y-6 mt-10">
      <h1 className="text-2xl font-semibold text-gray-800">WebRTC Recorder</h1>

      {/* Dropdown to select number of audience members */}
      <div className="flex space-x-4 border-white">
        <label className="text-white">Select Audience:</label>
        <select
          className="bg-black p-2 rounded-lg focus:outline-none"
          value={audienceCount}
          onChange={(e) => setAudienceCount(Number(e.target.value))}
        >
          {[...Array(5).keys()].map((i) => (
            <option key={i} value={i + 1}>
              {i + 1} Audience
            </option>
          ))}
        </select>
      </div>

      {/* Toggle to enable/disable video with icon */}
      <div className="flex items-center space-x-4">
        <label htmlFor="videoToggle" className="flex items-center">
          <Video className="mr-2" /> {/* Video icon */}
          <span className="text-gray-700">Video</span>
        </label>
        <input
          type="checkbox"
          id="videoToggle"
          checked={isVideoEnabled}
          onChange={() => setIsVideoEnabled((prev) => !prev)}
          className="toggle-checkbox hidden"
        />
        <label
          htmlFor="videoToggle"
          className="toggle-label relative inline-block w-10 h-6 bg-gray-300 rounded-full cursor-pointer"
        >
          <span
            className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform transform ${
              isVideoEnabled ? "translate-x-4 bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </label>
      </div>

      {/* Display audience silhouettes */}
      <div className="flex space-x-20 mt-4">
        {[...Array(audienceCount)].map((_, i) => (
          <div
            key={i}
            className="w-40 h-40 bg-gray-500 rounded-full flex items-center justify-center"
          >
            <span className="text-black text-8xl ">👤</span>
          </div>
        ))}
      </div>
      {/* Buttons to start/stop recording */}
      <div className="flex space-x-4 mt-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Stop Recording
          </button>
        )}
      </div>

      {/* Download Button */}
      {recordedChunks.length > 0 && (
        <button
          onClick={downloadRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Download {isVideoEnabled ? "Video" : "Audio"}
        </button>
      )}
    </div>
  );
};

export default WebRTCRecorder;
