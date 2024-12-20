import { useEffect, useState } from 'react';
import { BsFillMicFill } from 'react-icons/bs'; // Microphone icon

const MicrophonePulse = ({ isRecording }) => {
  const [volume, setVolume] = useState(0); // Track the volume level

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

      // Set up microphone access
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const average = array.reduce((a, b) => a + b) / array.length; // Average volume
          setVolume(average);
        };
      });
    }

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [isRecording]);

  return (
    <div className=" flex justify-center items-center rounded-lg w-96 h-96">
      {/* Pulsating circle around the microphone */}
      <div
        className="flex justify-center items-center rounded-full bg-gray-700  m-2"
        style={{
          width: `${180 + volume * 1}px`, // Adjust size dynamically based on volume
          height: `${180 + volume * 1}px`,
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      ><BsFillMicFill className="text-white " size={120} /></div>
      {/* Static microphone icon */}
      
    </div>
  );
};

export default MicrophonePulse;
