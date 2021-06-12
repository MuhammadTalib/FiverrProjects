import React, { useState } from 'react';
import './App.css';
import 'purecss/build/pure.css'
import { useSearchEngine, SearchEngineContextProvider } from './Contexts/SearchEngineContext';
import Search from './Components/Search'
import NavBar from './Components/NavBar';

function App() {

  const [viewNumber, setViewNumber] = useState(0);

  return (
    <SearchEngineContextProvider>
      <div id="mainHolder">
        <NavBar setViewNumber={setViewNumber} style={{flex:'1'}}></NavBar>


        <Search></Search>
      </div>
    </SearchEngineContextProvider>
  );
}

export default App;
