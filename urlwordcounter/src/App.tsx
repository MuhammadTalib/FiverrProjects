import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useSearchEngine, SearchEngineContextProvider } from './Contexts/SearchEngineContext';
import Search from './Components/Search'
import NavBar from './Components/NavBar';

function App() {

  const [viewNumber, setViewNumber] = useState(0);

  return (
    <SearchEngineContextProvider>
      <NavBar setViewNumber={setViewNumber}></NavBar>


      <Search></Search>

    </SearchEngineContextProvider>
  );
}

export default App;
