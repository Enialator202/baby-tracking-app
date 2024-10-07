// src/components/DiaperTracker.js
import React, { useState } from 'react';
import jsPDF from 'jspdf';
// import './DiaperTracker.css'; // Styles for the component

const DiaperTracker = () => {
  const [diaperType, setDiaperType] = useState(null); // 'wet', 'dry', or 'soiled'
  const [notes, setNotes] = useState(''); // User notes for the diaper change
  const [image, setImage] = useState(null); // Store the uploaded image
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [timestamp, setTimestamp] = useState(''); // Store the timestamp of the diaper change
  const [logs, setLogs] = useState([]); // To store diaper change logs

  // Handle diaper type selection
  const selectDiaperType = (type) => {
    setDiaperType(type);
    setTimestamp(new Date().toLocaleString());
  };

  // Handle image compression and storage
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800; // Set a max width for the compressed image
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          setImage(compressedDataUrl);
          setImagePreview(compressedDataUrl); // Display compressed image as preview
        };
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logging the diaper change
  const logDiaperChange = () => {
    if (!diaperType) {
      alert('Please select a diaper type before logging.');
      return;
    }

    const newLog = {
      diaperType,
      notes,
      image: imagePreview,
      timestamp,
    };

    setLogs([...logs, newLog]); // Add the new log to the logs array
    resetFields(); // Clear inputs after logging
  };

  // Reset fields after logging
  const resetFields = () => {
    setDiaperType(null);
    setNotes('');
    setImage(null);
    setImagePreview(null);
    setTimestamp('');
  };

  // Function to generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Diaper Change Logs", 10, 10);
    let y = 20; // Y position for the next text

    logs.forEach((log, index) => {
      doc.text(`Log #${index + 1}`, 10, y);
      doc.text(`Diaper Type: ${log.diaperType}`, 10, y += 10);
      doc.text(`Timestamp: ${log.timestamp}`, 10, y += 10);
      if (log.notes) {
        doc.text(`Notes: ${log.notes}`, 10, y += 10);
      } else {
        doc.text(`Notes: No notes provided`, 10, y += 10);
      }
      if (log.image) {
        const img = new Image();
        img.src = log.image;
        img.onload = () => {
          doc.addImage(img, 'JPEG', 10, y += 10, 50, 50); // Adjust the width and height as needed
        };
      }
      y += 60; // Increase y position for the next log
    });

    doc.save("diaper_change_logs.pdf");
  };

  return (
    <div className="diaper-tracker">
      <h2>Diaper Tracker</h2>

      {/* Diaper type selection */}
      <div className="diaper-type">
        <h3>Select Diaper Type</h3>
        <div className="buttons">
          <button onClick={() => selectDiaperType('poop')}>Poop</button>
          <button onClick={() => selectDiaperType('pee')}>Pee</button>
          <button onClick={() => selectDiaperType('both')}>Both</button>
        </div>
        {diaperType && <p>Selected Diaper Type: {diaperType} ({timestamp})</p>}
      </div>

      {/* Image Upload */}
      <div className="image-upload">
        <h3>Upload an Image (Optional)</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && <img src={imagePreview} alt="Uploaded Preview" className="image-preview" />}
      </div>

      {/* Notes Section */}
      <div className="diaper-notes">
        <h3>Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about the diaper change"
        />
      </div>

      {/* Log Button */}
      <button onClick={logDiaperChange}>Log Diaper Change</button>

      {/* Download PDF Button */}
      <button onClick={downloadPDF}>Download Logs as PDF</button>

      {/* Summary */}
      <div className="diaper-summary">
        <h3>Diaper Change Summary</h3>
        {logs.length > 0 ? (
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                <p>Diaper Type: {log.diaperType}</p>
                {log.image && <img src={log.image} alt="Logged Diaper Image" className="image-preview" />}
                <p>Notes: {log.notes || 'No notes provided'}</p>
                <p>Timestamp: {log.timestamp}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logs available.</p>
        )}
      </div>
    </div>
  );
};

export default DiaperTracker;
