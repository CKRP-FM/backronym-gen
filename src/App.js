import './App.css';
import { useState, useEffect } from 'react';
import Search from './components/Search.js';

function App() {

  // /words?ml=duck&sp=b*'
  



  return (
    <div className="App">
      <h1>Backronym Generator</h1>
      <Search />
    </div>
  );
}

export default App;
