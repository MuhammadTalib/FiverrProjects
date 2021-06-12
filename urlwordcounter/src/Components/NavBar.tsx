import React  from 'react'
import './NavBar.css'
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

import {useSearchEngine} from '../Contexts/SearchEngineContext';

type Props = {
    setViewNumber : (x:number)=>void
}

export default function NavBar(props: Props) {
    const { setViewNumber } = props;
    const { setCurrentView, currentView} = useSearchEngine();

    return (
      <>
        <div id="menu"><div className="pure-menu">
           <div className="pure-menu-heading" >SERP Shitter</div>
            <ul className="pure-menu-list">
              <Router>

              <Link to="/homeScreen">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(12);}}>
                    <a className={(currentView === 12)?"nav-link active":"pure-menu-link"}>Home</a>  
                  </li>
                </Link>

                <Link to="/keywordSuggestions">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(10);}}>
                    <a className={(currentView === 10)?"nav-link active":"pure-menu-link"}>Keyword Scraper</a>  
                  </li>
                </Link>

                <Link to="/keywordManager">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(11);}}>
                    <a className={(currentView === 11)?"nav-link active":"pure-menu-link"}>Keyword Manager</a>  
                  </li>
                </Link>

                <Link to="/keyWords">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(7);}}>
                    <a className={(currentView === 7)?"nav-link active":"pure-menu-link"}>Keywords</a>  
                  </li>
                </Link>

                <Link to="/filters">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(8);}}>
                    <a className={(currentView === 8)?"nav-link active":"pure-menu-link"}>Results Filter</a>  
                  </li>
                </Link>

                <Link to="/resultCount">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(1);}}>
                    <a className={(currentView === 1)?"nav-link active":"pure-menu-link"}>Search Results</a>  
                  </li>
                </Link>

                <Link to="/secondView">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(4);}}>
                    <a className={(currentView === 4)?"nav-link active":"pure-menu-link"}>Keywords per URL</a>  
                  </li>
                </Link>

                <Link to="/firstView">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(0);}}>
                    <a className={(currentView === 0)?"nav-link active":"pure-menu-link"}>Titles Split</a>  
                  </li>
                </Link>

                <Link to="/titleCount">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(3);}}>
                    <a className={(currentView === 3)?"nav-link active":"pure-menu-link"}>Titles</a>  
                  </li>
                </Link> 

                <Link to="/linkCount">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(2);}}>
                    <a className={(currentView === 2)?"nav-link active":"pure-menu-link"}>URLs</a>  
                  </li>
                </Link>

                <Link to="/urlWordCount">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(13);}}>
                    <a className={(currentView === 2)?"nav-link active":"pure-menu-link"}>URL Word Counts</a>  
                  </li>
                </Link>
            
                <Link to="/metaCount">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(5);}}>
                    <a className={(currentView === 5)?"nav-link active":"pure-menu-link"}>META Data</a>  
                  </li>
                </Link>

                <Link to="/wordCount">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(9);}}>
                    <a className={(currentView === 9)?"nav-link active":"pure-menu-link"}>Word counter</a>  
                  </li>
                </Link>    

                <Link to="/">
                  <li className="pure-menu-item" onClick={()=>{setCurrentView(6);}}>
                    <a className={(currentView === 6)?"nav-link active":"pure-menu-link"}>Settings</a>  
                  </li>
                </Link>          
              
              </Router>
            </ul>
           </div>
        </div> 
      </>
    )
}
