const PreviewModal = ({ isOpen, onClose, recordedChunks, isVideoEnabled }) => {
    if (!isOpen) return null;
  
    const blob = new Blob(recordedChunks, {
      type: isVideoEnabled ? "video/webm" : "audio/wav",
    });
    const url = URL.createObjectURL(blob);
  
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 bg-black bg-opacity-50 z-50">
        <div className="bg-gray-800 p-4 rounded-lg w-2/4 relative">
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-500"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-lg font-bold mb-4">Preview Recording</h2>
  
          {isVideoEnabled ? (
            <video src={url} controls className="w-full h-auto" />
          ) : (
            <audio src={url} controls className="w-full" />
          )}
  
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4 w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
    export default PreviewModal;