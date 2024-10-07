import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Welcome to the Baby Tracker</h2>
      <p>Choose a log type to get started:</p>
      <div className="log-options">
        <button>Log Feeding</button>
        <button>Log Diaper Change</button>
        <button>Log Sleep</button>
      </div>
    </div>
  );
};

export default Dashboard;
