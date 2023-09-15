import React from 'react';
import './App.css';
import { Grid } from './Grid'

function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        <p>Minesweeper</p>
        <p>Click any button to reset</p>
        <Grid></Grid>
      </header>
    </div>
  );
}

export default App;
