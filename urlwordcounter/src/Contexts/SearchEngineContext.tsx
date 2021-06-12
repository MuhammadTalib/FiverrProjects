import { hostname } from 'os';
import React, { useContext, useState,useEffect, Dispatch } from 'react'
import { callbackify } from 'util';
import {DomainRow} from '../Components/DomainGroupRow'
import { MetadataType, MetadataRow, MetadataLink } from '../Components/MetaGroupRow'
import SuggestionServiceEndpoint from '../Components/SuggestionEndpoints';

export type newType = {
    searchWithDelay: (keywords:string[], token: string, engineID: string, lg: string, lr: string, num: number, delay: number, callback: (filtered: boolean)=>void)=>void,
    stopTheSearch: ()=>void,
    currentView: number,
    setCurrentView : any,
    exportAllQueries : (keyWords: string[] | null)=>void,
    importAllQueries : (callBack: (keywords:string[])=>{})=>void,
    saveNewResult : (response: any)=>void,
    sessionResult: string[],
    setSessionResult: Dispatch<string[]>,
    currentLinkCount: {[keyWords: string] : string[]},
    setLinkCount: Dispatch<{[keyWords: string] : string[]}>,
    currentTitleCount: {[keyWords: string] : string[]},
    setTitleCount: Dispatch<{[keyWords: string] : string[]}>,
    queriesDone: number,
    setQueriesDone: Dispatch<number>,
    currentDomainData:{[hostname:string] : DomainRow},
    setDomainData: Dispatch<{[hostname:string] : DomainRow}>,
    metaData: MetadataType,
    setMetaData: Dispatch<MetadataType>,
    getFromTitle: boolean,
    setFromTitle: Dispatch<boolean>,
    getFromContent: boolean,
    setFromContent: Dispatch<boolean>,
    getFromBoldTitle: boolean,
    setFromBoldTitle: Dispatch<boolean>,
    getFromCrumbs: boolean,
    setFromCrumbs: Dispatch<boolean>,
    getFromOG: boolean,
    setFromOG: Dispatch<boolean>,
    getFromURL: boolean,
    setFromURL: Dispatch<boolean>,
    selectedServicePoints: string[],
    setSelectedServicePoints: Dispatch<string[]>,
    suggestions: {[suggestionWord: string]: {[suggestionFileter: string]: string[]}},
    setSuggestions: Dispatch<{[suggestionWord: string]: {[suggestionFileter: string]: string[]}}>,
    suggestKeywords: (keywords:string[], filters:string[], lg: string, lr: string, callback:()=>void)=>void,
    keyWordsTextSuggest: string,
    setKeyWordsTextSuggest: Dispatch<string>,
    suffixes : string,
    prefixes: string,
    setPrefixes: Dispatch<string>,
    setSuffixes: Dispatch<string>,
    selectedLang: string,
    selectedReg: string,
    setSelectedLang: Dispatch<string>,
    setSelectedReg: Dispatch<string>,
    currentSuggestionKW: string[],
    setCurrentSuggestionKW: Dispatch<string[]>,
    keywordInput: string,
    setKeywordInput: Dispatch<string>,
    keywordOutput: string,
    setKeywordOutput: Dispatch<string>,
    customSelection: string,
    setCustomSelection: Dispatch<string>,
    prefix: string,
    setPrefix: Dispatch<string>,
    suffix: string,
    setSuffix: Dispatch<string>,
    optionsSortFilter: boolean[],
    setOptionsFilter: Dispatch<boolean[]>,
    filterList: boolean[],
    setFilterList:Dispatch<boolean[]>,
    isCaseSensitive: boolean,
    setIsCaseSensitive: Dispatch<boolean>

    
}

const SearchContext = React.createContext<newType>({searchWithDelay:()=>{},stopTheSearch:()=>{}, currentView:0, setCurrentView:()=>{},exportAllQueries:()=>{},
    importAllQueries:()=>{}, saveNewResult:()=>{}, sessionResult:[],setSessionResult:()=>{},currentLinkCount:{}, setLinkCount:()=>{},currentTitleCount:{}, setTitleCount:()=>{}, queriesDone:0, setQueriesDone:()=>{},
    currentDomainData:{}, setDomainData:()=>{}, metaData: {}, setMetaData:()=>{}, getFromTitle: true, setFromTitle:()=>{},
    getFromContent:true, setFromContent:()=>{}, getFromBoldTitle:true, setFromBoldTitle:()=>{}, getFromCrumbs: true,
    setFromCrumbs:()=>{}, getFromOG:true, setFromOG:()=>{}, getFromURL:true, setFromURL:()=>{},selectedServicePoints:[],
    setSelectedServicePoints: ()=>{}, suggestions: {}, setSuggestions: ()=>{}, suggestKeywords:()=>{},
    keyWordsTextSuggest: "", setKeyWordsTextSuggest: ()=>{}, prefixes: "", setPrefixes:()=>{}, suffixes:"",
    setSuffixes:()=>{}, selectedLang:"", selectedReg:"", setSelectedLang:()=>{}, setSelectedReg:()=>{}, 
    currentSuggestionKW:[], setCurrentSuggestionKW:()=>{}, keywordInput:"", setKeywordInput:()=>{}, keywordOutput:"",
    setKeywordOutput:()=>{}, customSelection:"", setCustomSelection:()=>{}, prefix: "", setPrefix:()=>{},
    suffix:"", setSuffix:()=>{}, optionsSortFilter:[], setOptionsFilter:()=>{}, filterList:[false, false, false], 
    setFilterList:()=>{}, isCaseSensitive:false, setIsCaseSensitive: ()=>{}});

export const useSearchEngine = ()=>{
    return useContext(SearchContext);
}
declare const window: any;
export const SearchEngineContextProvider: React.FC = ({children})=>{


    //#region Count Words Component Setup

    const [getFromTitle, setFromTitle] = useState<boolean>(true);
    const [getFromContent, setFromContent] = useState<boolean>(true);
    const [getFromBoldTitle, setFromBoldTitle] = useState<boolean>(true);
    const [getFromCrumbs, setFromCrumbs] = useState<boolean>(true);
    const [getFromOG, setFromOG] = useState<boolean>(true);
    const [getFromURL, setFromURL] = useState<boolean>(true);

    //#endregion
    let resolveFunction: (value: unknown)=>void;
    let currentSearchInterval: NodeJS.Timeout;
    let index: number;
    let currentKeywords: Array<string>;
    let currentUrl: string;
    let fixedUrl: string;
    const [callBackMethodName, setCallBackMethodName] = useState<string>("");
    const [sessionResult, setSessionResult] = useState<string[]>([]);
    const [queriesDone, setQueriesDone] = useState<number>(0);
    let currentTitles : Array<String> = [];


    const [suggestions, setSuggestions] = useState<{[suggestionWord:string] :
                     {[suggestionFilter:string] : string[]}}>({});
    const [selectedServicePoints, setSelectedServicePoints] = useState<string[]>([]);

    const [currentView, setCurrentView] = useState(12);
    const [currentSavedQueries, setCurrentSavedQueries] = useState<[{[keyword:string] : any}, string[]]>([{},[]]);

    const [currentLinkCount, setLinkCount] = useState<{[keyWords: string] : string[]}>({});
    const [currentTitleCount, setTitleCount] = useState<{[keyWords: string] : string[]}>({});
    
    const [currentDomainData, setDomainData] = useState<{[hostname:string] : DomainRow}>({});

    const [metaData, setMetaData] = useState<MetadataType>({});

    const [keyWordsTextSuggest, setKeyWordsTextSuggest] = useState<string>("");

    const [prefixes, setPrefixes] = useState<string>("");
    const [suffixes, setSuffixes] = useState<string>("");

    const [selectedLang, setSelectedLang] = useState<string>("en");
    const [selectedReg, setSelectedReg] = useState<string>("us");

    const [currentSuggestionKW, setCurrentSuggestionKW] = useState<string[]>([]);

    const [keywordInput, setKeywordInput] = useState<string>("");
    const [keywordOutput, setKeywordOutput] = useState<string>("");
    const [customSelection, setCustomSelection] = useState<string>("");

    const [optionsSortFilter, setOptionsFilter] = useState<boolean[]>([]);
    const [filterList, setFilterList] = useState<boolean[]>([false, false, false, false]);
    const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);


    const [prefix, setPrefix] = useState<string>("");
    const [suffix, setSuffix] = useState<string>("");
    
    useEffect(()=>{

        let endpoints: string[] = [];
        for(let i in SuggestionServiceEndpoint){
            endpoints.push(i);
        }
        setSelectedServicePoints(endpoints);

    }, [])

    useEffect(() => {
        if(currentView === 0)setCallBackMethodName ("callBackData");
        if(currentView === 1)setCallBackMethodName("secondViewCallBackData");
        if(currentView === 2)setCallBackMethodName("countLinksCallBack");
    }, [currentView])

    const saveNewResult = (response: any)=>{
        if(response.error !== null && response.error !== undefined)return;
        let keyword : string = response.findMoreOnGoogle.url.split("&q=")[1].split("&cx")[0].replaceAll("+", " ");
        let auxQueries = currentSavedQueries[0];
        auxQueries[keyword] = Object.assign({}, response);
        setCurrentSavedQueries([auxQueries, currentSavedQueries[1]]);
    }

    const computeAllSavedQueries = async (keywords:string[]) : Promise<string[]>=>{
        await new Promise(resolve => setTimeout(resolve, 10));

        let sesRes = sessionResult;
        keywords = [...keywords];
        for(let i=0;i<keywords.length;i++){
            if(currentSavedQueries[0][keywords[i]] !== null && 
                currentSavedQueries[0][keywords[i]] !== undefined){
                    if(!sesRes.includes(keywords[i]))  
                            sesRes.push(keywords[i]);
                            
                            window.callBackAllMethods(currentSavedQueries[0][keywords[i]], true);

                    await new Promise(resolve => setTimeout(resolve, 10));
                    keywords.splice(i,1);

                    i--;
                }
        }
        setSessionResult(sesRes);

        return keywords;

    }
    let hasShownBlockedAlert:boolean;



    const searchWithDelay = async (keywords:string[], token: string, engineID: string, lg: string, lr: string, num: number, delay: number, callback: (filtered:boolean)=>void)=>{
        hasShownBlockedAlert = false;
        setQueriesDone(0);

        currentKeywords = [...await computeAllSavedQueries(keywords)];
        if(currentKeywords.length == 0){
            callback(true);
            stopTheSearch();
            return;
        }
        if(num < 0){
            stopTheSearch();
            return;
        }
        index =  0;
        fixedUrl = `https://cse.google.com/cse/element/v1?num=${num}&lr=${lr}&gl=${lg}&cx=${engineID}&q={TOBEADDED}&cse_tok=${token}&callback=callBackAllMethods`
        let promise = new Promise(async (resolve, reject)=>{
            while(sessionStorage.getItem('hasToStop') != 'true'){
                if(index >= currentKeywords.length){
                    callback(false);
                    resolve(0);
                    return;
                }
                let sesRes = sessionResult;
                if(!sesRes.includes(currentKeywords[index]))  
                sesRes.push(currentKeywords[index]);
                setSessionResult(sesRes);
                currentUrl = fixedUrl.replace("{TOBEADDED}", currentKeywords[index].toString());
                let s  = document.createElement("script");
                s.id   = 'sc'+index;
                s.type = "text/javascript";
                s.src  = currentUrl;
                
                    let script = document.body.appendChild(s)
                
                    script.onerror = async ()=>{
                        script.remove();
                        s.remove();
                        sessionStorage.setItem('hasToStop', 'true'); 

                        if(!hasShownBlockedAlert){
                            alert("Please try again in one hour!");
                            hasShownBlockedAlert = true;
                        }
                        stopTheSearch();
                        callback(false);
                        resolve(0);
                    }
               
               
                console.warn("API CALLED");
                await new Promise(resolveSmall => setTimeout(resolveSmall, 10));    
                s.remove();
                index++;
                await new Promise(resolveSmall => setTimeout(resolveSmall, delay));
            }
            sessionStorage.setItem('hasToStop', 'false'); 
            console.warn("CLOSED");
            resolve(1);
        });
    }



    const getGoogleAnswer = (response :any, currentWord: string, currentFilter: string)=>{
        let currentSuggestions = response[1];


        addAnswersToTheFilter(currentSuggestions, currentWord, currentFilter);
        
    }


    const getGooglePlayAnswer = (response :any, currentWord: string, currentFilter: string)=>{
        let arr: string[] = [];
        for(let i in response){
            arr.push(response[i].s);
        }

        addAnswersToTheFilter(arr, currentWord, currentFilter);
    
    }

    const getEbayAnswer = (response :any, currentWord: string, currentFilter: string)=>{
        let currentSuggestions = response.res.sug;

        addAnswersToTheFilter(currentSuggestions, currentWord, currentFilter);
        
    }

    const getBaiduAnswer = (response :any, currentWord: string, currentFilter: string)=>{
        let currentSuggestions = response;

        addAnswersToTheFilter(currentSuggestions, currentWord, currentFilter);
        
    }

    const getYahooAnswer = (response :any, currentWord: string, currentFilter: string)=>{
        let arr: string[] = [];
        for(let i in response.gossip.results){
            arr.push(response.gossip.results[i].key);
        }

        addAnswersToTheFilter(arr, currentWord, currentFilter);
    
    }


    const getTwitterAnswer = (response :any, currentWord: string, currentFilter: string)=>{
       
        let currentSuggestions :string[] = [];

        for(let i in response.topics){
            currentSuggestions.push(response.topics[i].topic);
        }

        addAnswersToTheFilter(currentSuggestions, currentWord, currentFilter);
    }
    

    const addAnswersToTheFilter = (s: string[], word: string, filter: string)=>{
        if(s === undefined)return;
        let currentS: {[suggestionWord: string]: {[suggestionFilter: string]: string[]}} = suggestions;
        if(currentS[word] === undefined){
            currentS[word] = {};
            currentS[word][filter] = s;
        }else{
            if(currentS[word][filter] === undefined){
                currentS[word][filter] = s;
            }else{
                currentS[word][filter] = currentS[filter][filter].concat(s);
            }
        }

        setSuggestions(Object.assign({}, currentS));
    }


    const suggestKeywords = async (keywords:string[], filters: string[], lg: string, lr: string,
                                    callback: ()=>void)=>{
        if(keywords.length == 0){
            callback();
            return;
        }


        for(let i=0; i<keywords.length; i++){
            if(Object.keys(suggestions).includes(keywords[i])){
                keywords.splice(i,1);
                i--;
            }
        }

        

        index =  0;
        let promise = new Promise(async (resolve, reject)=>{

            while(sessionStorage.getItem('hasToStopWordShitter') != 'true'){
                if(index >= keywords.length){
                    callback();
                    resolve(0);
                    return;
                }

                    for(let i in SuggestionServiceEndpoint){
                        let url = SuggestionServiceEndpoint[i];

                        url = url.replace("${lang}", lr);
                        url = url.replace("${country}", lg);
                        url = url.replace("${callback}", "callBackWordShitter");
                        url += keywords[index];

                        const currentFilter = i;
                        const currentWord = keywords[index];
                        fetch(url)
                        .then(response => {
                            return response.text();
                        })
                        .then(data =>{ 
                            if(currentFilter==="baidu"){
                                data = data.split('us(')[1];
                            }else{
                                data = data.split('callBackWordShitter(')[1];
                            }

                                let finalChar;
                                if(data[0] === "["){
                                    finalChar = "]";
                            }else{
                                finalChar = "}";
                            }
                            let ind = data.length-1;
                           while(data[ind] !== finalChar){
                               ind --;
                           }
                            data = data.substring(0, ind+1);
                            

                                if(currentFilter === "baidu"){
                                    data = data.split('s:')[1];
                                    data = data.substring(0, data.length-1);
                                    data = JSON.parse(data);
                                }else{
                                    data = JSON.parse(data);
                                }
                    
                            
                           switch(currentFilter){
                                case "google": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google shopping": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google news": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google books": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google videos": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "youtube": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google images": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "bing": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "amazon": 
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "yahoo": 
                                        getYahooAnswer(data, currentWord, currentFilter);
                                        break;
                                case "ebay":
                                        getEbayAnswer(data, currentWord, currentFilter);
                                        break;
                                case "twitter":
                                        getTwitterAnswer(data, currentWord, currentFilter);
                                        break;
                                case "baidu":
                                        getBaiduAnswer(data, currentWord, currentFilter);
                                        break;
                                case "yandex":
                                        getGoogleAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google play":
                                        getGooglePlayAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google play apps":
                                        getGooglePlayAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google play movies":
                                        getGooglePlayAnswer(data, currentWord, currentFilter);
                                        break;
                                case "google play books":
                                        getGooglePlayAnswer(data, currentWord, currentFilter);
                                        break;
                           }
                        
                        }).catch(err =>{
                            console.log(err);
                        });
                        
                        // console.warn("CALLED ENDPOINT FOR " + filters[i]);
                        await new Promise(resolveSmall => setTimeout(resolveSmall, 10));    
                    }

                index++;
                await new Promise(resolveSmall => setTimeout(resolveSmall, 2000));
            }
            sessionStorage.setItem('hasToStopWordShitter', 'false'); 
            console.warn("CLOSED");
            resolve(1);
        });
    }






    const exportAllQueries = async (keyWords:string[] | null)=>{
        const fileName = "file";
        const json = JSON.stringify([currentSavedQueries,keyWords]);
        const blob = new Blob([json],{type:'application/json'});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const importAllQueries = async(callBack: (keywords:string[])=>{})=>{
        setSessionResult([]);
            let input = document.createElement("input");
            input.type = "file";
            input.click();
            input.onchange = (event: any)=>{
                let file = "";
                if(event.target !== null)
                    file = event.target.files[0];

                    var reader = new FileReader();
                    reader.onload = (e : any)=>{
                        var obj = JSON.parse(e.target.result);
                        setCurrentSavedQueries(obj[0]);
                        callBack(Object.getOwnPropertyNames(obj[0][0]));
                    };
                    reader.readAsText(event.target.files[0]);
            }
    }

    const stopTheSearch = ()=>{
        sessionStorage.setItem('hasToStop', 'true');
        // clearInterval(currentSearchInterval);
    }

    const value:newType = {
        searchWithDelay,
        stopTheSearch,
        currentView,
        setCurrentView,
        saveNewResult,
        exportAllQueries,
        importAllQueries,
        sessionResult,
        setSessionResult,
        currentLinkCount,
        setLinkCount,
        currentTitleCount,
        setTitleCount,
        queriesDone,
        setQueriesDone,
        currentDomainData,
        setDomainData,
        metaData,
        setMetaData,
        getFromTitle,
        setFromTitle,
        getFromContent,
        setFromContent,
        getFromBoldTitle,
        setFromBoldTitle,
        getFromCrumbs,
        setFromCrumbs,
        getFromOG,
        setFromOG,
        getFromURL,
        setFromURL,
        selectedServicePoints,
        setSelectedServicePoints,
        suggestions,
        setSuggestions,
        suggestKeywords,
        keyWordsTextSuggest,
        setKeyWordsTextSuggest,
        suffixes,
        setSuffixes,
        prefixes,
        setPrefixes,
        selectedLang,
        selectedReg,
        setSelectedLang,
        setSelectedReg,
        currentSuggestionKW,
        setCurrentSuggestionKW,
        keywordInput,
        setKeywordInput,
        keywordOutput,
        setKeywordOutput,
        customSelection,
        setCustomSelection,
        suffix,
        setSuffix,
        prefix,
        setPrefix,
        setFilterList,
        filterList,
        optionsSortFilter,
        setOptionsFilter,
        isCaseSensitive,
        setIsCaseSensitive
      }
    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    )
}
