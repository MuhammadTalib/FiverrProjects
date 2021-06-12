import React, { useState, useEffect, useRef } from 'react'
import { InputGroup, FormControl, Container, Row,
             Col, Button, Form } from 'react-bootstrap';

import { Collapse } from 'react-collapse'

import { useSearchEngine } from '../Contexts/SearchEngineContext'

import SuggestionServiceEndpoint from './SuggestionEndpoints'
import './KeyWordsShitter.css'

import regions from './GoogleRegions'
import langauges from './GoogleLanguages'
import languages from './GoogleLanguages';

type Props = {
    lr: string,
    lg : string
};

export default function KeywordShitterComponent(props: Props) {

    const collapseIconUp = 
<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-up"id="upArrow" className="collapseIcon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M177 255.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 351.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 425.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1zm-34-192L7 199.7c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.4-96.4 96.4 96.4c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9l-136-136c-9.2-9.4-24.4-9.4-33.8 0z"></path></svg>;

    const collapseIconDown = 
<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-up" id="downArrow" className="collapseIcon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M177 255.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 351.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 425.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1zm-34-192L7 199.7c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.4-96.4 96.4 96.4c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9l-136-136c-9.2-9.4-24.4-9.4-33.8 0z"></path></svg>;
  
  
  
  const { selectedServicePoints, setSelectedServicePoints, suggestKeywords,
    keyWordsTextSuggest, setKeyWordsTextSuggest, suggestions, prefixes, suffixes,
    setPrefixes, setSuffixes, selectedLang, selectedReg, setSelectedLang, setSelectedReg,
    currentSuggestionKW, setCurrentSuggestionKW } = useSearchEngine();      

    const [serviceEndpoints, setServiceEndpoints] = useState<string[]>([]);
    const [openFilters, setOpenFilters] = useState<boolean>(false);

    const [computedSuggestions, setComputedSuggestions] = useState<string>();

    const [filters, setFilters] = useState<string[]>(["google"]);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(()=>{

        showFiltered();

    },[suggestions]);

    useEffect(()=>{
        showFiltered();
    }, [filters]);

    const showFiltered = ()=>{
        let keyWords: string[] = currentSuggestionKW;

        let auxComputedSuggestions : string[] = [];

        for(let i in keyWords){
            if(!Object.keys(suggestions).includes(keyWords[i]))continue;
            
            for( let j in suggestions[keyWords[i]]){
                
                if(!filters.includes(j))continue;
                
                for(let k in suggestions[keyWords[i]][j]){
                     if(!auxComputedSuggestions.includes(suggestions[keyWords[i]][j][k])){
                        auxComputedSuggestions.push(suggestions[keyWords[i]][j][k]);
                     }
                }

            }
            
        }

        setComputedSuggestions(auxComputedSuggestions.join('\n'));

    }

    useEffect(()=>{
        let endpoints: string[] = [];
        for(let i in SuggestionServiceEndpoint){
            endpoints.push(i);
        }
        // setSelectedServicePoints(endpoints);
        setServiceEndpoints(endpoints);
        setFilters([...selectedServicePoints]);
    }, []);


    const applyFilters = ()=>{
        setFilters([...selectedServicePoints]);
    }

    const startJob = ()=>{
        setFilters([...selectedServicePoints]);

        let keyWords: string[] = keyWordsTextSuggest.split('\n');
        keyWords = keyWords.filter(s=>s!="");
        if(isLoading){
            sessionStorage.setItem('hasToStopWordShitter', 'true'); 
            setIsLoading(false);
            return;
        }
        if(keyWords.length == 0){
            return;
        }
        let curPref = prefixes.split(',');
        curPref = curPref.filter(s=>s!="");
        curPref.push("");

        let curSuf = suffixes.split(',');
        curSuf = curSuf.filter(s=>s!="");
        curSuf.push("");

        let currentKeywords: string[] = [];

        for(let pre in curPref){
            for(let w in keyWords){
                for(let suf in curSuf){
                    currentKeywords.push(curPref[pre]+keyWords[w]+curSuf[suf]);
                }
            }
        }

        setCurrentSuggestionKW(currentKeywords);
        
        sessionStorage.setItem('hasToStopWordShitter', 'false'); 
        setIsLoading(true);

        suggestKeywords(currentKeywords, filters, selectedReg, selectedLang, ()=>{
            setIsLoading(false);
            console.warn("Keyword suggestions done !")
        });

        //start the search
    }

    const selectOption = (opt: string)=>{
        let updatedServicePoints: string[] = selectedServicePoints;
        if(updatedServicePoints.includes(opt)){
            updatedServicePoints = updatedServicePoints.filter(x=>x!= opt);
        }else{
            updatedServicePoints.push(opt);
        }
        setSelectedServicePoints([...updatedServicePoints]);
    }

    return (
        <>
        <div>
            <Container className="vw-80 vh-100" style={{margin:'0', border:'none',padding:'0', maxWidth:'4000px'}}>
                <Row className="h-100" style={{margin:'0'}}>
                    <Col className="col" style={{margin:'0'}}>

                        <Container className="vw-80 vh-100">

                            <Row>
                                <Col>
                                <h2>Keywords</h2>
                                <textarea disabled={isLoading} value={keyWordsTextSuggest} onChange={(e)=>setKeyWordsTextSuggest(e.currentTarget.value)} placeholder="Type your keywords in here.."
                                        className="form-control" style={{minHeight:"300px", height:'80%', width:'110%'}}></textarea>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <h2>Suggestions</h2>
                        <textarea readOnly={true} value={computedSuggestions} className="form-control"
                         style={{minHeight:"300px", height:'80%', width:'110%'}}></textarea>
                                </Col>
                            </Row>


                        </Container>


                    </Col>
                    
                    <Col xs={8}>
                        <Container style={{margin:'0', border:"1px solid rgba(0,0,0,0.3)", borderRadius:'10px', padding:'30px', transform:'scale(0.9) translateY(-30px)'}}>
                    {
                        serviceEndpoints.map((el, i)=>{

                                    if(i%3 !== 0)return "";
                                    return(
                                            <Row key={i}>
                                                <Col>
                                                        <Form.Group onClick={(e: { preventDefault: () => void; })=>{
                                                            e.preventDefault();
                                                            selectOption(serviceEndpoints[i]);
                                                         }}>
                                                            <Form.Check checked={selectedServicePoints.includes(serviceEndpoints[i])} type="checkbox" label={serviceEndpoints[i]} />
                                                        </Form.Group>
                                                </Col>

                                             
                                                <Col>
                                                        <Form.Group onClick={(e: { preventDefault: () => void; })=>{
                                                            e.preventDefault();
                                                            selectOption(serviceEndpoints[i+1]);
                                                         }}>
                                                            <Form.Check checked={selectedServicePoints.includes(serviceEndpoints[i+1])} type="checkbox" label={serviceEndpoints[i+1]} />
                                                        </Form.Group>
                                                </Col>   

                                                
                                                <Col>
                                                        <Form.Group onClick={(e: { preventDefault: () => void; })=>{
                                                            e.preventDefault();
                                                            selectOption(serviceEndpoints[i+2]);
                                                         }}>
                                                            <Form.Check checked={selectedServicePoints.includes(serviceEndpoints[i+2])} type="checkbox" label={serviceEndpoints[i+2]} />
                                                        </Form.Group>
                                                </Col>
                                             
                                            </Row>
                                        )
                                        })

                    }

                        <Button style={{backgroundColor:"rgb(25, 24, 24)"}} onClick={applyFilters}>Filter results to selection</Button>
                    
                          <Row style={{marginTop:'35px'}}>
                        <Col>
                        <h5>Service settings</h5>
                        <table className="table table-slim settings">
                        <tbody>
                        <tr><td><label >Search langauge:</label></td><td>
                            <select value={selectedLang} onChange={(e)=>setSelectedLang(e.currentTarget.value)} 
                            style={{backgroundColor:'rgba(248,248,248,1)', width:'110%', marginLeft:'-10%'}} disabled={isLoading===true}>
                                {
                                    languages.map(el=>
                                        <option value={el[0]}>{el[1]}</option>
                                        )
                                }
                            </select>
                        </td></tr>
                        <tr><td><label>Search country: </label></td><td>

                        <select value={selectedReg} onChange={(e)=>setSelectedReg(e.currentTarget.value)}
                                 style={{backgroundColor:'rgba(248,248,248,1)', width:'110%', marginLeft:'-10%'}} disabled={isLoading===true}>
                                {
                                    regions.map(el=>
                                        <option value={el[0]}>{el[1]}</option>
                                        )
                                }
                            </select>      
                      
                            </td></tr>
                        <tr><td><label>Prefixes</label></td><td>
                            <textarea placeholder={"pre, before, which, what, ..."} value={prefixes} onChange={(e)=>setPrefixes(e.currentTarget.value)} 
                        disabled={isLoading===true} name="lg" style={{width:'110%', marginLeft:'-10%', border:'none', backgroundColor:'rgba(248,248,248,1)'}}/></td></tr>
                        <tr><td><label>Suffixes</label></td><td>
                            <textarea placeholder={"after, yet, pro, free, ..."}  value={suffixes}  onChange={(e)=>setSuffixes(e.currentTarget.value)}
                        disabled={isLoading===true} name="lg" style={{width:'110%', marginLeft:'-10%', border:'none', backgroundColor:'rgba(248,248,248,1)'}}/></td></tr>
                      
                        </tbody>
                        </table>
                        </Col>
                  
                    </Row>
                        <p style={{color:'red', fontWeight:"bold", fontSize:"11px"}}>You need <a target="_blank" href="https://mni.me/go/unblocker">CORS Unblocker</a> set to "On".<br/><br/></p>
                        <Button style={{backgroundColor:"rgb(25, 24, 24)", float:'left', marginTop:'-15px'}} onClick={startJob} > {(!isLoading)?"Start scraping":"Stop"} </Button>
                        
                        </Container>
                    </Col>
                </Row>

            </Container>
        </div>
      
        </>
    )
}
