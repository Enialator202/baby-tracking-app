import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './FeedingTracker.css'; // Styles for the component

const FeedingTracker = () => {
  // States for tracking feeding
  const [activeBreast, setActiveBreast] = useState(null); // 'left' or 'right'
  const [leftBreastTime, setLeftBreastTime] = useState(0);
  const [rightBreastTime, setRightBreastTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [formulaAmount, setFormulaAmount] = useState(0); // Minimum set to 0
  const [pumpedMilkAmount, setPumpedMilkAmount] = useState(0); // Minimum set to 0
  const [notes, setNotes] = useState('');
  const [manualLeftTime, setManualLeftTime] = useState(0);
  const [manualRightTime, setManualRightTime] = useState(0);
  const [logs, setLogs] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  // Function to format time in mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Function to start the timer for a specific breast
  const startTimer = (breast) => {
    pauseTimer(); // Pause all timers before starting a new one

    setActiveBreast(breast);
    const newIntervalId = setInterval(() => {
      if (breast === 'left') {
        setLeftBreastTime((prev) => prev + 1);
      } else if (breast === 'right') {
        setRightBreastTime((prev) => prev + 1);
      }
    }, 1000); // Update every second

    setIntervalId(newIntervalId);
    setTimerRunning(true);
  };

  // Function to pause the timer
  const pauseTimer = () => {
    clearInterval(intervalId);
    setTimerRunning(false);
  };

  // Function to reset the timer
  const resetTimer = () => {
    clearInterval(intervalId);
    setLeftBreastTime(0);
    setRightBreastTime(0);
    setTimerRunning(false);
    setActiveBreast(null); // Reset active breast
  };

  // Function to log the feeding session
  const logFeeding = () => {
    const newLog = {
      timestamp: new Date().toLocaleString(),
      leftTime: manualLeftTime * 60 + leftBreastTime,
      rightTime: manualRightTime * 60 + rightBreastTime,
      formula: formulaAmount,
      pumpedMilk: pumpedMilkAmount,
      notes: notes,
    };

    setLogs((prevLogs) => [...prevLogs, newLog]);
    resetForm(); // Reset form after logging
  };

  // Function to reset the input form
  const resetForm = () => {
    setManualLeftTime(0);
    setManualRightTime(0);
    setFormulaAmount(0); // Reset formula amount to 0
    setPumpedMilkAmount(0); // Reset pumped milk amount to 0
    setNotes('');
    resetTimer();
  };

  // Function to download logs as PDF
  // Function to download logs as PDF
const downloadLogs = () => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let yOffset = 20; // Initial vertical offset

  doc.setFontSize(12);
  doc.text('Feeding Logs', 10, yOffset);
  yOffset += 10;

  logs.forEach((log, index) => {
    const logData = [
      `Date: ${log.timestamp}`,
      `Left Breast Time: ${formatTime(log.leftTime)}`,
      `Right Breast Time: ${formatTime(log.rightTime)}`,
      `Formula: ${log.formula ? log.formula + ' oz' : 'N/A'}`,
      `Pumped Milk: ${log.pumpedMilk ? log.pumpedMilk + ' oz' : 'N/A'}`,
      `Notes: ${log.notes || 'None'}`,
    ];

    logData.forEach((text) => {
      // Check if yOffset exceeds the page height to add a new page
      if (yOffset > pageHeight - 20) {
        doc.addPage();
        yOffset = 20; // Reset yOffset for new page
      }
      doc.text(text, 10, yOffset);
      yOffset += 10; // Move down the page after each line
    });

    // Add extra space between logs
    yOffset += 10;
  });

  // Save the PDF
  doc.save('feeding_logs.pdf');
};


  // Render the component
  return (
    <div className="feeding-tracker">
      <h2>Feeding Tracker</h2>

      {/* Timer section for breastfeeding */}
      <div className="breastfeeding-timer">
        <h3>Breastfeeding Timer</h3>
        <div className="buttons">
          <button onClick={() => startTimer('left')}>Start Left Breast</button>
          <button onClick={() => startTimer('right')}>Start Right Breast</button>
        </div>
        <div className="timer-display">
          <p>Left Breast: {formatTime(leftBreastTime)}</p>
          <p>Right Breast: {formatTime(rightBreastTime)}</p>
        </div>
        <div className="timer-controls">
          <button onClick={pauseTimer}>Pause</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>

      {/* Manual Time Input Section */}
      <div className="manual-time-input">
        <h3>Manual Time Input</h3>
        <div>
          <label htmlFor="manual-left-time">Left Breast Time (minutes):</label>
          <input
            type="number"
            id="manual-left-time"
            value={manualLeftTime}
            onChange={(e) => setManualLeftTime(Math.max(0, e.target.value))}
            placeholder="Enter minutes"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="manual-right-time">Right Breast Time (minutes):</label>
          <input
            type="number"
            id="manual-right-time"
            value={manualRightTime}
            onChange={(e) => setManualRightTime(Math.max(0, e.target.value))}
            placeholder="Enter minutes"
            min="0"
          />
        </div>
      </div>

      {/* Formula and Pumped Milk Section */}
      <div className="formula-pumped-milk">
        <h3>Formula/Pumped Milk</h3>
        <div className="formula-cards">
          <label htmlFor="formula-amount">Formula (oz):</label>
          <input
            type="number"
            id="formula-amount"
            value={formulaAmount}
            onChange={(e) => setFormulaAmount(Math.max(0, e.target.value))}
            placeholder="Enter oz"
            min="0"
          />
        </div>
        <div className="pumped-milk-cards">
          <label htmlFor="pumped-milk-amount">Pumped Milk (oz):</label>
          <input
            type="number"
            id="pumped-milk-amount"
            value={pumpedMilkAmount}
            onChange={(e) => setPumpedMilkAmount(Math.max(0, e.target.value))}
            placeholder="Enter oz"
            min="0"
          />
        </div>
      </div>

      {/* Notes Section */}
      <div className="feeding-notes">
        <h3>Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this feeding session"
        />
      </div>

      {/* Log Feeding Button */}
      <button onClick={logFeeding}>Log Feeding Session</button>

      {/* Logs Table */}
      <div className="feeding-logs">
        <h3>Feeding Logs</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Left Breast (mm:ss)</th>
              <th>Right Breast (mm:ss)</th>
              <th>Formula (oz)</th>
              <th>Pumped Milk (oz)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{formatTime(log.leftTime)}</td>
                <td>{formatTime(log.rightTime)}</td>
                <td>{log.formula || 'N/A'}</td>
                <td>{log.pumpedMilk || 'N/A'}</td>
                <td>{log.notes || 'No notes provided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={downloadLogs}>Download Logs (PDF)</button>
      </div>
    </div>
  );
};

export default FeedingTracker;
