import React from 'react';
import TemperatureTable from './TemperatureTable';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="App">
      <TemperatureTable />
    </div>
  );
}

export default App;