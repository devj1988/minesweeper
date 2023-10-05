import React from 'react';
import './App.css';
import { Grid } from './Grid'
import 'bootstrap/dist/css/bootstrap.css';
import Badge from 'react-bootstrap/Badge';

function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        <h1><Badge bg="success">Minesweeper</Badge></h1>
        <Badge bg="secondary" style={{marginTop: "10px", marginBottom: "10px"}}>Click any button to reset</Badge>
        <Grid></Grid>
      </header>
    </div>
  );
}

export default App;
