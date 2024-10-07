import React from 'react';

const LogHistory = ({ logs }) => {
  return (
    <div className="log-history">
      <h2>Log History</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {log.timestamp}: {log.type} - {log.amount || 'N/A'}oz {log.notes}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogHistory;
