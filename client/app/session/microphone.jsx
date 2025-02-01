import { useEffect, useState } from "react";
import { BsFillMicFill } from "react-icons/bs";

const MicrophonePulse = ({ isRecording }) => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;

    if (isRecording) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const average = array.reduce((a, b) => a + b) / array.length;
          setVolume(average);
        };
      });
    }

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content">
      <div
        className="relative flex items-center justify-center rounded-full bg-primary shadow-lg transition-all ease-in-out duration-200"
        style={{
          width: `${150 + volume * 1.2}px`,
          height: `${150 + volume * 1.2}px`,
          boxShadow: `0px 0px ${10 + volume / 5}px #3ABDF8`,
        }}
      >
        <BsFillMicFill className="text-neutral" size={100} />
      </div>
      {isRecording ? (
        <p className="mt-4 text-secondary text-lg animate-pulse">Listening...</p>
      ) : (
        <p className="mt-4 text-error">Not Recording</p>
      )}
    </div>
  );
};

export default MicrophonePulse;
