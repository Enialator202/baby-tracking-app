// src/components/SleepTracker.js
import React, { useState } from 'react';
import jsPDF from 'jspdf'; // To download logs as PDF

const SleepTracker = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState([]);

  // Helper function to calculate sleep duration in hours and minutes
  const calculateDuration = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    
    let diffMs = endTime - startTime; // Difference in milliseconds
    if (diffMs < 0) {
      // Handle case where endTime is past midnight (next day)
      diffMs += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }

    const diffHrs = Math.floor(diffMs / 1000 / 60 / 60); // Convert milliseconds to hours
    const diffMins = Math.floor((diffMs / 1000 / 60) % 60); // Convert remaining milliseconds to minutes

    return `${diffHrs}h ${diffMins}m`; // Format as "h m"
  };

  // Function to handle sleep session submission
  const handleSubmit = () => {
    if (startTime >= endTime) {
      alert('End time should be after start time!');
      return;
    }

    const sleepDuration = calculateDuration(startTime, endTime);
    
    const sleepData = {
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      sleepDuration, // Include calculated sleep duration
      notes,
      timestamp: new Date().toLocaleString(), // Log the current date and time
    };

    setLogs([...logs, sleepData]); // Add the new log to the logs array
    resetFields();
  };

  // Format time to 12-hour format with AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Convert to 12-hour format
    return `${hour12}:${minutes} ${ampm}`;
  };

  const resetFields = () => {
    setStartTime('');
    setEndTime('');
    setNotes('');
  };

  // Function to download the logs as a PDF
  const downloadLogs = () => {
    const doc = new jsPDF();
    let yOffset = 20; // Initial vertical offset

    doc.setFontSize(12);
    doc.text('Sleep Logs', 10, yOffset);
    yOffset += 10;

    logs.forEach((log) => {
      const logData = [
        `Date: ${log.timestamp}`,
        `Start Time: ${log.startTime}`,
        `End Time: ${log.endTime}`,
        `Sleep Duration: ${log.sleepDuration}`,
        `Notes: ${log.notes || 'None'}`,
      ];

      logData.forEach((text) => {
        if (yOffset > doc.internal.pageSize.height - 20) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(text, 10, yOffset);
        yOffset += 10;
      });

      yOffset += 10; // Extra space between logs
    });

    doc.save('sleep_logs.pdf');
  };

  return (
    <div className="sleep-tracker">
      <h2>Sleep Tracker</h2>
      <div>
        <label>Start Time:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div>
        <label>End Time:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this sleep session"
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>

      {/* Display logs in a table */}
      {logs.length > 0 && (
        <div className="logs-section">
          <h3>Sleep Logs</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{log.timestamp}</td>
                  <td>{log.startTime}</td>
                  <td>{log.endTime}</td>
                  <td>{log.sleepDuration}</td>
                  <td>{log.notes || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={downloadLogs}>Download Logs as PDF</button>
        </div>
      )}
    </div>
  );
};

export default SleepTracker;
