import React, { useState, useEffect, MouseEventHandler } from 'react'
import { InputGroup, FormControl, Container, Row,
             Col, Button, Table, Form } from 'react-bootstrap';
import WordCountRow from './WordCountRow';

import { useSearchEngine } from '../Contexts/SearchEngineContext'


export type WordCountProps = {
    word: string,
    freq: number,
    freqInTitle: number,
    freqInContent: number,
    freqInBoldTitle: number,
    freqInCrumbs: number,
    freqInOG: number,
    freqInURL: number
}

type Props = {
    data: WordCountProps[]
}

const increasingSortIcon = 
<svg aria-hidden="true" focusable="false" className="sortIconIncreasing" data-prefix="fas" data-icon="sort-amount-up-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.39-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160z"></path></svg>

const decreasingSortIcon = 
<svg aria-hidden="true" focusable="false" className="sortIconDecreasing" data-prefix="fas" data-icon="sort-amount-up-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.39-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160z"></path></svg>


export default function CountWordsComponent(props: Props) {

    let { data } = props;

    
    const { getFromTitle, setFromTitle, getFromContent, setFromContent,
        getFromBoldTitle, setFromBoldTitle, getFromCrumbs, setFromCrumbs,
        getFromOG, setFromOG, getFromURL, setFromURL } = useSearchEngine();
        
        const [ filteredData, setFilteredData] = useState<WordCountProps[]>([]);
        const [sort, setSort] = useState<number>(0);
    

    useEffect(()=>{
        applyFilters();
    }, [])
    

    const sortByIndex = (index: number)=>{
        let s = sort;
        if(s !== undefined){
        if(Math.abs(s) !== index){
            setSort(index);
            return;
        }

            s *= -1; 
            setSort(s);
        }
    }

    const applyFilters = ()=>{
        for(let i in data){
            data[i].freq = 0;
            if(getFromTitle){
                data[i].freq += data[i].freqInTitle;
            }    
            if(getFromContent){
                data[i].freq += data[i].freqInContent;
            }
            if(getFromBoldTitle){
                data[i].freq += data[i].freqInBoldTitle;
            }
            if(getFromCrumbs){
                data[i].freq += data[i].freqInCrumbs;
            }
            if(getFromOG){
                data[i].freq += data[i].freqInOG;
            }
            if(getFromURL){
                data[i].freq += data[i].freqInURL;
            }
        }
        setFilteredData([...data]);
    }

    const getSortedData = () :WordCountProps[] => {
        if(sort === 1){
            return filteredData.sort((a: WordCountProps,b : WordCountProps)=>{
                return (a.word.localeCompare(b.word));
            });
        }
        if(sort === -1){
            return filteredData.sort((a: WordCountProps,b : WordCountProps)=>{
                return (b.word.localeCompare(a.word));
            });
        }

        if(sort === 2){
            return filteredData.sort((a: WordCountProps,b : WordCountProps)=>{
                return (a.freq - b.freq);
            });
        }

        return filteredData.sort((a: WordCountProps,b : WordCountProps)=>{
            return (b.freq - a.freq);
        });

    }

    return (
        <>
        <div>
            <Container style={{border:"1px solid rgba(0,0,0,0.3)", borderRadius:'10px', width:'30%', minWidth:'350px', padding:'30px'}}>
                <Row>
                    <Col>
                        <Form.Group onClick={(e: { preventDefault: () => void; })=>{
                            e.preventDefault();
                            setFromTitle(!getFromTitle);
                        }} controlId="formBasicCheckbox" >
                            <Form.Check checked={getFromTitle} type="checkbox" label="Titles" />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group onClick={(e: any)=>{
                            e.preventDefault();
                            setFromCrumbs(!getFromCrumbs);
                            }} controlId="formBasicCheckbox2" >
                            <Form.Check checked={getFromCrumbs} type="checkbox" label="Breadcrumbs formatted" />
                        </Form.Group>
                    </Col>

                </Row>

                <Row>
                    <Col style={{}}>
                        <Form.Group onClick={(e: any)=>{
                            e.preventDefault();setFromContent(!getFromContent)}} controlId="formBasicCheckbox3" >
                            <Form.Check checked={getFromContent} type="checkbox" label="Descriptions" />
                        </Form.Group>
                    </Col>
                    
                    <Col style={{}}>
                        <Form.Group onClick={(e: any)=>{
                            e.preventDefault();setFromURL(!getFromURL)}} controlId="formBasicCheckbox4" >
                            <Form.Check checked={getFromURL} type="checkbox" label="URLs formatted" />
                        </Form.Group>
                    </Col>

                </Row>

                <Row>

                    <Col style={{}}>
                        <Form.Group onClick={(e: any)=>{
                            e.preventDefault();setFromBoldTitle(!getFromBoldTitle)}}  controlId="formBasicCheckbox5" >
                            <Form.Check checked={getFromBoldTitle} type="checkbox" label="Google bold titles" />
                        </Form.Group>
                    </Col>

                    <Col style={{}}>
                        <Form.Group onClick={(e: any)=>{
                            e.preventDefault();setFromOG(!getFromOG)}} controlId="formBasicCheckbox6" >
                            <Form.Check checked={getFromOG} type="checkbox" label="OG Type" />
                        </Form.Group>
                    </Col>

                </Row>
                    <Button style={{backgroundColor:"rgb(25, 24, 24)"}} onClick={applyFilters}>Apply filters</Button>
            </Container>

        </div>


        <Table className="pure-table" style={{marginTop:"50px"}}>
                    <thead>

            <tr>
                            <th onClick={()=>sortByIndex(1)} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>Word</span>
                                    {sort === 1 && increasingSortIcon}
                                    {sort === -1 && decreasingSortIcon}
                                </div>
                            </th>
                        
                            <th onClick={()=>sortByIndex(2)} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>Frequency</span>
                                    {sort === 2 && increasingSortIcon}
                                    {sort === -2 && decreasingSortIcon}
                                </div>
                            </th>
              </tr>
            </thead>
            <tbody>

            {
                getSortedData().map((el, ind)=>{
                    if(el.freq > 0)
                    return (
                            <React.Fragment key={ind}>
                                <WordCountRow word={el.word} freq={el.freq}></WordCountRow>
                            </React.Fragment>)

                    return "";

                    }
                )
            }


            </tbody>
            </Table>

        </>
    )
}
