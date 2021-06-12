import { resourceLimits } from 'node:worker_threads';
import React, { useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useSearchEngine } from '../Contexts/SearchEngineContext'
export default function KeywordManager() {
    const {  keywordInput,
        setKeywordInput,
        keywordOutput,
        setKeywordOutput,
        customSelection,
        setCustomSelection,
        suffix,
        setSuffix,
        prefix,
        setPrefix,
        filterList,
        setFilterList,
        optionsSortFilter,
        setOptionsFilter,
        isCaseSensitive,
        setIsCaseSensitive } = useSearchEngine();
   
    const selectionRef = useRef<HTMLSelectElement>(null);

    const selectThisOption = (index: number)=>{
        let opts = filterList;
        for(let i=0;i<opts.length;i++){
            if(i === index){
                opts[i] = true;
            }else{
                opts[i] = false;
            }
        }
        setFilterList([...opts]);
    }
    const sanitizeInputs = (inputKeywords: string[])=>{
        return inputKeywords.filter(x=>x.replaceAll(' ', '') !="");
    }
    const getSelection = async ()=>{
        let currentSelection :string[] = [];
        if(selectionRef && selectionRef.current){
            for(let i in selectionRef.current.selectedOptions){
                let resp: any, respText: string;
                switch(selectionRef.current.selectedOptions[i].value){
                    case "CUSTOM": currentSelection.push(...customSelection.split('\n'));break;
                    case "ENGLISHSTOP": 
                         resp = await fetch("https://app.converting.click/filters/stopwords.txt");
                         respText = await resp.text();
                        currentSelection.push(...respText.split('\n'));
                        break;
                    case "USACITIES": 
                         resp = await fetch("https://app.converting.click/filters/us-cities.txt");
                         respText = await resp.text();
                         currentSelection.push(...respText.split('\n'));
                        break;
                    case "USASTATES": 
                        // resp = await fetch("https://app.converting.click/filters/stopwords.txt");
                        // respText = await resp.text();
                        // currentSelection.push(...respText.split('\n'));
                        break;
                    case "CHARS":
                        resp = await fetch("https://app.converting.click/filters/characters.txt");
                        respText = await resp.text();
                        currentSelection.push(...respText.split('\n'));
                        break;
                }
            }
        }        
        return currentSelection;
    }

    const removeWordsFromKeywords = async ()=>{
        let inputKeywords: string[] = sanitizeInputs(keywordInput.split('\n'));
        let selection: string[] = sanitizeInputs(await getSelection());

        let result :string[] = [];
        let flags = 'g' + ((!isCaseSensitive)?'i':'');
        console.log(flags);

        for(let i in inputKeywords){
            let res : string = inputKeywords[i];
            for(let j in selection){
                let regex: RegExp = new RegExp("\\b" + selection[j] + "\\b", flags);
                res = res.replaceAll(regex, '');
            }
            result.push(res);
        }

        setKeywordOutput(result.join('\n'));
        
    }

    const removeWholeLineFromKeywords = async ()=>{
        let inputKeywords: string[] = sanitizeInputs(keywordInput.split('\n'));
        let selection: string[] = sanitizeInputs(await getSelection());

        let result :string[] = [];

        let flags = 'g' + ((!isCaseSensitive)?'i':'');
        console.log(flags);

        for(let i in inputKeywords){
            let found = false;
            for(let j in selection){
                let regex: RegExp = new RegExp("\\b" + selection[j] + "\\b", flags);
                if(regex.test(inputKeywords[i])){
                    found = true;
                    break;
                }
            }
            if(found === false){
                result.push(inputKeywords[i]);
            }
        }

        setKeywordOutput(result.join('\n'));
        
    }


    const keepWordsFromKeywords = async ()=>{
        let inputKeywords: string[] = sanitizeInputs(keywordInput.split('\n'));
        let selection: string[] = sanitizeInputs(await getSelection());

        let result :string[] = [];

        let flags = 'g' + ((!isCaseSensitive)?'i':'');
        console.log(flags);

        for(let i in inputKeywords){
            let words : string[] = inputKeywords[i].match(/\b(\w+)\b/g) || [];
    
            words = words.filter(x=>{
                for(let i in selection){
                    if(selection[i].toLowerCase() === x.toLocaleLowerCase() && !isCaseSensitive){
                        return true;
                    }
                    if(selection[i] === x && isCaseSensitive){
                        return true;
                    }
                }
                return false;
            });
            
            if(words.length > 0)
            result.push(words.join(' '));
        }

        setKeywordOutput(result.join('\n'));
        
    }

    const keepWholeLineFromKeywords = async ()=>{
        let inputKeywords: string[] = sanitizeInputs(keywordInput.split('\n'));
        let selection: string[] = sanitizeInputs(await getSelection());

        let result :string[] = [];

        let flags = 'g' + ((!isCaseSensitive)?'i':'');
        console.log(flags);

        for(let i in inputKeywords){
            let found = false;
            for(let j in selection){
                let regex: RegExp = new RegExp("\\b" + selection[j] + "\\b", flags );
                if(regex.test(inputKeywords[i])){
                    found = true;
                    break;
                }
            }
            if(found === true){
                result.push(inputKeywords[i]);
            }
        }

        setKeywordOutput(result.join('\n'));
        
    }

    
    const applyFilters = ()=>{
        if(filterList[0] === true){
            removeWordsFromKeywords();
            return;
        }
        if(filterList[1] === true){
            removeWholeLineFromKeywords();
            return;
        }
        if(filterList[2] === true){
            keepWordsFromKeywords();
            return;
        }
        if(filterList[3] === true){
            keepWholeLineFromKeywords();
            return;
        }
    }

    const addPrefixAndSuffix = ()=>{
        let inputKeywords: string[] = sanitizeInputs(keywordOutput.split('\n'));
        
        let result :string = "";
        for(let i in inputKeywords){
            result += prefix + inputKeywords[i] + suffix + "\n";
        }

        setKeywordOutput(result);
    }

    return (
        <div>

            <div className="row">
                <div className="col col-lg-5" style={{margin:'0', paddingRight:'0', flex:'5'}}>
                    <div className="heading">
                        <label>
                            Paste your scraped keywords here
                        </label>
                    </div>
                    <textarea value={keywordInput} onChange={e=>setKeywordInput(e.currentTarget.value)} placeholder="keyword one&#10;keyword two"
                                className="form-control" style={{minHeight:"250px"}}></textarea>
                </div>

                <div className="col col-lg-3" style={{margin:'0', paddingLeft:'10px', paddingRight:'10px', flex:'3'}}>
                    <div className="heading">
                        <label>
                            Sort / Filter
                        </label>
                    </div>

                    <select ref={selectionRef} multiple size={5} style={{width:'100%', minHeight:"250px"}}>
                        <option value={"CUSTOM"}>CUSTOM SELECTION</option>
                        <option value={"ENGLISHSTOP"}>English Stop-words</option>
                        <option value={"CHARS"}>Characters and symbols</option>
                        <option value={"USACITIES"}>USA Cities</option>
                        <option value={"USASTATES"}>USA Cities</option>

                    </select>
                </div>

                <div className="col col-lg-5" style={{margin:'0', paddingLeft:'0', flex:'5'}}>
                    <div className="heading">
                        <label>
                            Output keywords after filtering
                        </label>
                    </div>
                    <textarea value={keywordOutput} onChange={e=>setKeywordOutput(e.currentTarget.value)} placeholder="Keywords will appear here after you pres [Apply filter] "
                                className="form-control" style={{minHeight:"250px"}}></textarea>
                </div>


            </div>

            <div className="row" style={{marginTop:"30px"}}>
                <div className="col col-lg-5" style={{margin:'0', paddingRight:'0', flex:'5'}}>
                </div>


                <div className="col col-lg-3" style={{margin:'0', paddingLeft:'10px', paddingRight:'10px' , flex:'3'}}>
                    <div className="heading">
                        <label>
                            CUSTOM SELECTION of keywords
                        </label>
                    </div>
                    <textarea value={customSelection} onChange={e=>setCustomSelection(e.currentTarget.value)} placeholder="keyword to remove&#10;or keyword to keep"
                                className="form-control" style={{minHeight:"250px"}}></textarea>
                </div>


                <div className="col col-lg-5 pure-form pure-form-stacked" style={{margin:'0', paddingLeft:'0', flex:'5'}}>
                    <p style={{marginLeft:'10px'}}>Add for each line:</p>

                    <div style={{display:'flex'}}>
                        <div>
                            <label htmlFor="stacked-prefix">Prefix</label>
                            <input value={prefix} onChange={e=>setPrefix(e.currentTarget.value)} type="text" style={{height:'30px', width:'150px'}} id="stacked-prefix" placeholder="" />
                        </div>
                        <div style={{marginLeft:'10px'}}>
                            <label htmlFor="stacked-suffix">Suffix</label>
                            <input value={suffix} onChange={e=>setSuffix(e.currentTarget.value)} type="text" style={{height:'30px', width:'150px'}} id="stacked-suffix" placeholder="" />
                        </div>
                    </div>
                    <Button style={{backgroundColor:'rgb(25, 24, 24)', marginTop:'20px'}} onClick={addPrefixAndSuffix}>
                        Add prefix / suffix
                    </Button>
                    <Button style={{marginLeft:'10px', backgroundColor:'rgb(25, 24, 24)', marginTop:'20px'}} onClick={()=>{
                        setPrefix("");
                        setSuffix("");
                    }}>
                        Reset
                    </Button>
                </div>


            </div>

            <div className="row">
                <div className="col col-lg-4" style={{margin:'0', paddingRight:'0'}}>
                </div>


                <div className="col col-lg-4" style={{margin:'0', paddingLeft:'10px', paddingRight:'10px'}}>
                  
                <Form style={{marginLeft:'20%'}}>
                            <Form.Check
                                type={"checkbox"}
                                label={`Remove words only`}
                                onChange={()=>selectThisOption(0)}
                                checked = {filterList[0]}
                                readOnly={true}
                            />
                             <Form.Check
                                type={"checkbox"}
                                label={`Remove entire keyword`}
                                checked = {filterList[1]}
                                onChange={()=>selectThisOption(1)}
                                readOnly={true}
                            />
                            <Form.Check
                                type={"checkbox"}
                                label={`Keep words only`}
                                onChange={()=>selectThisOption(2)}
                                checked = {filterList[2]}
                                readOnly={true}
                            />
                            <Form.Check
                                type={"checkbox"}
                                label={`Keep entire keyword`}
                                onChange={()=>selectThisOption(3)}
                                checked = {filterList[3]}
                                readOnly={true}
                            />

                            <Form.Check
                                type={"checkbox"}
                                label={`Is case sensitive`}
                                onChange={()=>setIsCaseSensitive(!isCaseSensitive)}
                                checked = {isCaseSensitive}
                                readOnly={true}
                            />
                    <Button style={{backgroundColor:'rgb(25, 24, 24)', width:'75%', marginTop:'20px'}} onClick={applyFilters}>
                        Apply Filters
                    </Button>
                    </Form>

                </div>


                <div className="col col-lg-4">
                </div>


            </div>


        </div>
    )
}
