// src/App.js
import React from 'react';
import './App.css';
import DiaperTracker from './components/DiaperTracker'; // Import DiaperTracker
import SleepTracker from './components/SleepTracker'; // Import SleepTracker
import FeedingTracker from './components/FeedingTracker'; // Import FeedingTracker

const App = () => {
  return (
    <div className="app">
      <h1>Baby Tracker App</h1>
      <FeedingTracker />  {/* Render FeedingTracker */}
      <SleepTracker />    {/* Render SleepTracker */}
      <DiaperTracker />   {/* Render DiaperTracker */}
    </div>
  );
};

export default App;
