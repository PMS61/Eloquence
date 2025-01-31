import { useState } from "react";
import { BsFillCameraVideoFill } from "react-icons/bs"; // Video icon

const ToggleSwitch = ({ isVideoEnabled, setIsVideoEnabled }) => {
  return (
    <div className="flex items-center py-4">
      <BsFillCameraVideoFill className="text-gray-800 mr-2" size={24} />
      <label className="relative inline-block w-12 mr-2">
        <input
          type="checkbox"
          checked={isVideoEnabled}
          onChange={() => setIsVideoEnabled(!isVideoEnabled)}
          className="sr-only"
        />
        <span className="block bg-gray-300 w-12 h-6 rounded-full cursor-pointer transition"></span>
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition transform ${
            isVideoEnabled ? "translate-x-6 bg-green-400" : ""
          }`}
        ></span>
      </label>
      <span className="text-neutral-200">{isVideoEnabled ? "Video Enabled" : "Audio Only"}</span>
    </div>
  );
};

export default ToggleSwitch;