"use client";
import { useEffect, useRef, useState } from 'react';

const WebRTCRecorder = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

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
        console.error('Error accessing media devices.', err);
      }
    }
    getMedia();

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
    if (!isVideoEnabled) {
      // Convert audio Blob to WAV
      const blob = new Blob(recordedChunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.wav'; // Download as .wav
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // Download video as webm
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.webm'; // Download as .webm for video
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 mt-10">
      <h1 className="text-2xl font-semibold text-gray-800">WebRTC Recorder</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => setIsVideoEnabled((prev) => !prev)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none"
        >
          {isVideoEnabled ? 'Disable Video' : 'Enable Video'}
        </button>
      </div>

      {isVideoEnabled && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-lg h-72 bg-gray-800 rounded-lg"
        />
      )}

      <div className="flex space-x-4">
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

      {recordedChunks.length > 0 && (
        <button
          onClick={downloadRecording}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Download {isVideoEnabled ? 'Video' : 'Audio'}
        </button>
      )}
    </div>
  );
};

export default WebRTCRecorder;

