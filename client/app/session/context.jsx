import { useState, useEffect } from "react";
import mammoth from "mammoth"; // For DOCX files
import pdfToText from "react-pdftotext"; // For PDF files
import "../components/bg.css";

const ContextDialog = ({ isOpen, onClose, onSave, initialContext }) => {
  const [text, setText] = useState(""); // User-entered text
  const [uploadedText, setUploadedText] = useState(""); // For script files
  const [title, setTitle] = useState(""); // New state for title

  useEffect(() => {
    if (isOpen && initialContext) {
      setText(initialContext);
    }
  }, [isOpen, initialContext]);

  const handleSave = () => {
    onSave({ title, text }); // Save both title and text
    onClose(); // Close dialog
  };

  // Handle file upload and parsing
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    if (fileType === "txt") {
      reader.onload = (event) => setUploadedText((prev) => prev + "\n" + event.target.result);
      reader.readAsText(file);
    } else if (fileType === "docx") {
      const buffer = await file.arrayBuffer();
      mammoth
        .extractRawText({ arrayBuffer: buffer })
        .then((result) => setUploadedText((prev) => prev + "\n" + result.value))
        .catch(() => alert("Failed to parse DOCX file."));
    } else if (fileType === "pdf") {
      try {
        const extractedText = await pdfToText(file);
        setUploadedText((prev) => prev + "\n" + extractedText);
      } catch (error) {
        alert("Failed to extract text from PDF.");
      }
    } else {
      alert("Unsupported file format. Please upload TXT, DOCX, or PDF.");
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="glass-bg p-4 rounded-lg shadow-lg w-96 max-h-screen overflow-auto">
        <h2 className="text-xl text-white font-semibold mb-4">Enter Context</h2>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4 text-white bg-gray-800"
          placeholder="Enter title for the session..."
        />

        {/* Context Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-lg resize-none text-white overflow-auto bg-gray-800"
          placeholder="Enter context here..."
          rows="5"
          style={{ maxHeight: "60vh" }}
        ></textarea>

        {/* Uploaded Script Content */}
        {uploadedText && (
          <div className="mt-4 p-2 border rounded text-white bg-gray-800 overflow-auto max-h-[30vh]">
            <h3 className="font-medium mb-2">Uploaded Script Content</h3>
            <div>{uploadedText}</div>
          </div>
        )}

        {/* Add Script Button */}
        <div className="flex items-center justify-between mt-4">
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
          >
            Add Script
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt, .docx, .pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ContextDialog;