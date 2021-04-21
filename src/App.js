import React from 'react';
import TemperatureVisualization from './TemperatureVisualization';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="App">
      <TemperatureVisualization />
    </div>
  );
}

export default App;