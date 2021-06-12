import React, { useEffect, useState, useRef } from 'react'
import { useSearchEngine } from '../Contexts/SearchEngineContext'
import { Table, Button, Form, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import UserTableRow from './UserTableRow';
import { blockWords } from './BlockWords'
import { specialCharacters } from './specialCharacters'
import ResultCountRow from './ResultCountRow'
import { convertToObject, resolveTripleslashReference } from 'typescript';
import UserTableRowLinkCount from './UserTableRowLinkCount'
import ProgressBar from 'react-bootstrap/ProgressBar'
import DomainGroupRow from './DomainGroupRow'
import {DomainRow,} from '../Components/DomainGroupRow'
import metaDataTemplate from '../Resources/csvjson.json'
import {MetaGroupRow, MetadataLink, MetadataType, MetadataRow} from '../Components/MetaGroupRow'

import { WordCountProps }  from './CountWordsComponent'

import { time } from 'console';
import { stringify } from 'querystring';
import CountWordsComponent from './CountWordsComponent';
import KeywordShitterComponent from './KeywordShitterComponent';
import KeywordManager from './KeywordManager';
import WelcomeScreen from './WelcomeScreen';
import UrlWordCount from './UrlWordCount';

declare const window: any;

export default function Search() {

    const wordCountSplitChars = [' ', '_', '-', '/', ',', '.', '|', '!',';',':','\'','"',')', '('];
    
    const { searchWithDelay, stopTheSearch, currentView, saveNewResult,
        importAllQueries, exportAllQueries, sessionResult, setSessionResult, currentLinkCount,
        setLinkCount, currentTitleCount, setTitleCount, queriesDone, setQueriesDone, setDomainData, 
        currentDomainData, metaData, setMetaData} = useSearchEngine();
    let keyWords: Array<string> = [];
     window.savedTitles = [];
     
    const buttonColor = "rgb(25, 24, 24)";
    let token = "";

    const [data, setData] = useState<{ [keyWords: string] : Array<string[]>; }>({}); 

    const [isCustomCX, setCustomCX] = useState<boolean>(false);

    const [sortIndex, setSortIndex] = useState<number>(0);

    const [secondViewData, setSecondViewData] = useState< [{resultsCount:number, title: string}]>();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [savedTitles, setSavedTitles] = useState<string[][]>([]);
    const [eliminateStopWords, setEliminateStopWords] = useState(false);
    const [showOnlyDomains, setShowOnlyDomains] = useState<boolean>(false);
    const [eliminateSymbols, setEliminateSymbols] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [appTime, setAppTime] = useState(0);
    const searchButton:any = useRef();
    const [keywordsFieldValue, setKeywordsFieldValue] = useState<string>("");
    const [filterDomains, setFilterDomains] = useState<string>("");
    const [showDomainCheckmark, setShowDomainCheckmark] = useState<boolean>(false);
    const [showDomainCheckmarkSettings, setShowDomainCheckmarkSettings] = useState<boolean>(false);


    const [wordsToBeCounted, setWordsToBeCounted] = useState<WordCountProps[]>([]);

    const [filteredByCache, setFilteredByCache] = useState<boolean>(false);

    const [cxState, setCx] = useState<string>("");
    const [lgState, setLg] = useState<string>("");
    const [lrState, setLr] = useState<string>("");
    const [numState, setNum] = useState<string>("");
    const [delayState, setDelay] = useState<string>(""); 
    

    const increasingSortIcon = 
    <svg aria-hidden="true" focusable="false" className="sortIconIncreasing" data-prefix="fas" data-icon="sort-amount-up-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.39-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160z"></path></svg>

    const decreasingSortIcon = 
    <svg aria-hidden="true" focusable="false" className="sortIconDecreasing" data-prefix="fas" data-icon="sort-amount-up-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.39-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160z"></path></svg>

    var keys : { [keyWords: string] : Array<string>; } = {};
    const [totalKeywords, setTotalKeywords] = useState<number>(0);

    useEffect(()=>{

        window.onbeforeunload = (event: any) => {

            const e = event || window.event;
            // Cancel the event
            e.preventDefault();
            if (e) {
              e.returnValue = ''; // Legacy method for cross browser support
            }
            return ''; // Legacy method for cross browser support
          };

            setCx(localStorage.getItem("cx") || 'b5b62ecd198cd5065');
            setLg(localStorage.getItem("lg") || 'us');
            setLr(localStorage.getItem("lr") || 'lang_en');
            setNum(localStorage.getItem("num") || '20');
            setDelay(localStorage.getItem("delay") || "10000");

    },[]);
    useEffect(()=>{
        console.log(isCustomCX);
    }, [isCustomCX])

    window.callBackAllMethods = (response:any, isDirectRequest?:boolean)=>{ 
        if(isDirectRequest === undefined){
            response.originalResults = response.results;
            saveNewResult(response);
        }else{
            response.results = response.originalResults;
        }

            let time = timeLeft - parseInt(delayState)/1000;
            setTimeLeft(time);

        keyWords = keywordsFieldValue.split('\n');

        let currentQueriesDone = queriesDone;
        currentQueriesDone++;
        setQueriesDone(currentQueriesDone);

        //eliminate the filtered domains
        let filteredDomainsList = filterDomains.split('\n');
        
        try{
            if(showOnlyDomains === true){   
                response.results = response.results.filter((res: { breadcrumbUrl: { host: string; }; }) => filteredDomainsList.includes(res.breadcrumbUrl.host));
            }else{
                response.results = response.results.filter((res: { breadcrumbUrl: { host: string; }; }) =>!filteredDomainsList.includes(res.breadcrumbUrl.host));
            }
        }catch(err: any){
            alert("Search failed. Please turn on the CORS Unblocker extension!");
            setIsLoading(false);
            stopTheSearch();
            return;
        }
        
        window.callBackData(response, isDirectRequest);
        window.secondViewCallBackData(response, isDirectRequest);
        window.countLinksCallBack(response, isDirectRequest);
        window.countTitlesCallBack(response, isDirectRequest);
        window.callBackDomainGroup(response, isDirectRequest);
        window.callBackMetadata(response, isDirectRequest);
        window.callBackCountWords(response, isDirectRequest);
    }

    window.callBackWordShitter = (response: any)=>{
        console.log(response);
    }

    const getActualObject = (result: any, tags: string[]): any=>{
            if(result === undefined || tags.length === 0)return result;
            result = result[tags[0]];
            tags.splice(0,1);
            return getActualObject(result, tags);
    }
    window.callBackMetadata = (response:any, isDirectRequest?:boolean)=>{
        if(isLoading === false && isDirectRequest === undefined)return;

        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            stopTheSearch();
            return
        }
       
        let currentMetaData: MetadataType = {};
        for(let k in metaData) currentMetaData[k] = metaData[k];

        const {results} = response;

        for(let r in results){
            const result = results[r];
            for(let meta in metaDataTemplate){
                let tags = metaDataTemplate[meta].ObjectName.split('.');

                const {Title} = metaDataTemplate[meta];
                const {Description} = metaDataTemplate[meta];
                
                let obj = getActualObject(result, tags);
                if(obj !== undefined){
                    if(currentMetaData[Title] === undefined){
                        currentMetaData[Title] = {
                            description: Description,
                            name: Title,
                            links: [{
                                link: result.url,
                                content: obj
                            }]
                        }
                    }else{
                        currentMetaData[Title].links.push({link: result.url, content: obj});
                    }
                    
                } 
                
            }
        }
        setMetaData(currentMetaData);

    }
    window.callBackDomainGroup = (response:any, isDirectRequest?:boolean)=>{
        if(isLoading === false && isDirectRequest === undefined)return;

        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            stopTheSearch();
            return
        }
        
        let currentGroup:{ [domain: string] : DomainRow} = {};
        for(var k in currentDomainData) currentGroup[k]= currentDomainData[k];

        let keyword : string = response.findMoreOnGoogle.url.split("&q=")[1].split("&cx")[0].replaceAll("+", " ");

       
        const {results} = response;
        for(let i in results){
            let host = results[i].breadcrumbUrl.host;

            let path = results[i].url.slice(results[i].url.indexOf(host)+host.length,results[i].url.length);

            if(currentGroup[host] === undefined){
                let allKeys= results[i].titleNoFormatting;
                if(eliminateSymbols === true){
                    for(let i=0;i<specialCharacters.length;i++){
                        allKeys = allKeys.replaceAll(specialCharacters[i], "");
                    }
                } 
                if(eliminateStopWords === true){
                    for(let i=0;i<blockWords.length;i++){
                        allKeys = allKeys.replaceAll("\\b" + blockWords[i] + "\\b", "");
                    }
                }   
                 
                let allKeysWs : string[] = allKeys.split(' ');

                currentGroup[host] = {
                    linkNumber: 1,
                    keywordNumber: 1,
                    hostName: host,
                    allKeyWords: allKeysWs,
                    path: [{path:path, keyWordNumber:1, title: results[i].titleNoFormatting,
                    keywords:[{keyword:keyword, position:+i+1, description: results[i].contentNoFormatting}]}]
                    }
                }else{

                    let allKeys= results[i].titleNoFormatting;
                    if(eliminateSymbols === true){
                        for(let i=0;i<specialCharacters.length;i++){
                            allKeys = allKeys.replaceAll(specialCharacters[i], "");
                        }
                    }    
                    if(eliminateStopWords === true){
                        for(let i=0;i<blockWords.length;i++){
                            allKeys = allKeys.replaceAll(blockWords[i], "");
                        }
                    }
                    
                    let allKeysWs : string[] = allKeys.split(' ');

                    let ind = currentGroup[host].path.find((el)=>el.title === results[i].titleNoFormatting);
                    currentGroup[host].allKeyWords.push(...allKeysWs);
                    
                    if(ind !== undefined){
                        ind.keywords.push({keyword:keyword, position: +i+1, description: results[i].contentNoFormatting});
                        continue;
                    }

                    currentGroup[host].path.push({path:path, keyWordNumber:1, title: results[i].titleNoFormatting,
                        keywords:[{keyword:keyword, position:(+i+1), description: results[i].contentNoFormatting}]});
                }
            }
        
        setDomainData(currentGroup);
    }

    window.callBackData = (response:any, isDirectRequest?:boolean)=>{ 
        if(isLoading === false && isDirectRequest === undefined)return;
        
        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            stopTheSearch();
            return
        }

        let currentTitles : string[][] = savedTitles;
        let auxData:{ [keyWords: string] : Array<string[]>; } = {};
        for(let i in response.results){
            currentTitles.push([response.results[i].titleNoFormatting, response.results[i].url]);
        }
        setSavedTitles(currentTitles);

        currentTitles.map((title)=>{

            if(eliminateStopWords === true){
                title[0] = title[0].split(' ').filter(a=> !blockWords.includes(a.toLowerCase())).join(', ');
            }
            if(eliminateSymbols === true){
                for(let i=0;i<specialCharacters.length;i++){
                    title[0] = title[0].replaceAll(specialCharacters[i], "");
                }
            }    

            title[0].split(' ').map(keyword=>{
                        if(keyword === "")return;
                            if(auxData[keyword] === undefined){
                                auxData[keyword] = [title];
                            }else{
                                auxData[keyword].push(title);
                            }
                    })
                });

        setData(auxData);
    }

    const countWordsIn = (currentWords: WordCountProps[], input: string, inputType: number)=>{

            let resWords = wordCountSplitChars.reduce((old, c) => old.map(v => v.split(c)).flat(), [input]);

            for(let i in resWords){
                resWords[i] = resWords[i].replaceAll(/(\n|&nbsp;|<br>|<br \/>)/g, '');
                if(resWords[i] === "") continue;
                let found: boolean = false;
                for(let j in currentWords){
                    if(resWords[i] == currentWords[j].word){
                        switch(inputType){
                            case 0: currentWords[j].freqInTitle ++;break;
                            case 1: currentWords[j].freqInContent ++;break;
                            case 2: currentWords[j].freqInBoldTitle ++;break;
                            case 3: currentWords[j].freqInCrumbs ++;break;
                            case 4: currentWords[j].freqInOG ++;break;
                            case 5: currentWords[j].freqInURL ++;break;
                            default: break;
                        }
                        found = true;
                    }
                }
                if(!found){
                    let res : WordCountProps = {freqInURL: 0,freqInCrumbs:0, freqInOG: 0,freqInBoldTitle: 0,
                            freqInContent: 0, word: resWords[i], freq: 1, freqInTitle: 0};

                    switch(inputType){
                        case 0: res.freqInTitle = 1;break;
                        case 1: res.freqInContent = 1;break;
                        case 2: res.freqInBoldTitle = 1;break;
                        case 3: res.freqInCrumbs = 1;break;
                        case 4: res.freqInOG = 1;break;
                        case 5: res.freqInURL = 1;break;
                        default: break;
                    }

                    currentWords.push(res);
                }
            }
            return currentWords;
        }


    window.callBackCountWords = (response:any, isDirectRequest?:boolean)=>{ 
        if(isLoading === false && isDirectRequest === undefined)return;
        
        
        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            stopTheSearch();
            return
        }
        
        let currentWords: WordCountProps[] = wordsToBeCounted;
        
        for(let i in response.results){
            
            let sanitizeTitle: string = response.results[i].titleNoFormatting;
            let sanitizeContent: string = response.results[i].contentNoFormatting;
            let sanitizeBoldTitle: string = response.results[i].title;
            if(eliminateStopWords === true){
                for(let j=0;j<blockWords.length;j++){
                    sanitizeTitle = sanitizeTitle.replaceAll(new RegExp("\\b" + blockWords[j] + "\\b", "gi"), "");
                    sanitizeContent = sanitizeContent.replaceAll(new RegExp("\\b" + blockWords[j] + "\\b", "gi"), "");
                    sanitizeBoldTitle = sanitizeBoldTitle.replaceAll(new RegExp("\\b" + blockWords[j] + "\\b", "gi"), "");
                }
            }   

            currentWords = countWordsIn(currentWords, sanitizeTitle, 0);
            
            currentWords = countWordsIn(currentWords, sanitizeContent, 1);
            
            let boldTitleString = sanitizeBoldTitle.split('<b>')[1]?.split('</b>')[0];

            if(boldTitleString !== undefined){   
                currentWords = countWordsIn(currentWords, boldTitleString, 2);
            }

            if(response.results[i].breadcrumbUrl.crumbs !== undefined){
                let crumbs = response.results[i].breadcrumbUrl.crumbs.join(' ');
                currentWords = countWordsIn(currentWords, crumbs, 3);
            }

        
            if(response.results[i].richSnippet !== undefined && response.results[i].richSnippet.metatags !== undefined 
                    && response.results[i].richSnippet.metatags.ogType !== undefined ){
                        currentWords = countWordsIn(currentWords, response.results[i].richSnippet.metatags.ogType, 4);
                    }


            currentWords = countWordsIn(currentWords, response.results[i].url, 5);


        }
        
        setWordsToBeCounted([...currentWords]);
    }


    window.countLinksCallBack = (response: any, isDirectRequest?:boolean)=>{
        if(isLoading === false && isDirectRequest === undefined)return;

        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            stopTheSearch();
            return
        }

        let currentCount:{ [keyWords: string] : string[] } = {};
        for(var k in currentLinkCount) currentCount[k]=currentLinkCount[k];

        let keyword : string = response.findMoreOnGoogle.url.split("&q=")[1].split("&cx")[0].replaceAll("+", " ");
        
        for(let i in response.results){
            let currentLink = response.results[i].url;
            if(currentCount[currentLink] == undefined){
                currentCount[currentLink] = [keyword];
            }else{
                currentCount[currentLink].push(keyword);
            }
        }
        setLinkCount(currentCount)
    }

    window.countTitlesCallBack = (response: any, isDirectRequest?:boolean)=>{
        if(isLoading === false && isDirectRequest === undefined)return;

        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            stopTheSearch();
            return
        }

        let currentCount:{ [keyWords: string] : string[] } = {};
        for(var k in currentTitleCount) currentCount[k]= currentTitleCount[k];

        for(let i in response.results){
            let currentTitle = response.results[i].titleNoFormatting;
            if(currentCount[currentTitle] == undefined){
                currentCount[currentTitle] = [response.results[i].url];
            }else{
                currentCount[currentTitle].push(response.results[i].url);
            }
        }
        setTitleCount(currentCount)
    }


    window.secondViewCallBackData = (response:any, isDirectRequest?:boolean)=>{
        if(isLoading === false && isDirectRequest === undefined)return;
        if(response == undefined || response.findMoreOnGoogle == undefined || response.findMoreOnGoogle.url == undefined){
            alert("Activate CORS, then try again OR wait 1 hour if blocked.");
         
            stopTheSearch();
            return
        }
        
        let keyword : string = response.findMoreOnGoogle.url.split("&q=")[1].split("&cx")[0].replaceAll("+", " ");
        let d = secondViewData;
        if(d === undefined || d === null){
            d = [{
                title:keyword,
                resultsCount: response.cursor.estimatedResultCount
            }]
        }else{
            d.push({
                title:keyword,
                resultsCount: response.cursor.estimatedResultCount
            })
        }
        let aux: any = [];
        for(let i=0;i<d.length;i++){
            aux.push({resultsCount: d[i].resultsCount, title : d[i].title});
        }
        setSecondViewData(aux);
    }

    const customCXClick = ()=>{
        setCustomCX(!isCustomCX);
    }



    const changeApp = (e : any)=>{
            setKeywordsFieldValue(e.target.value);
            let kws: string[] = e.target.value.split('\n');
            let currentTime: number = 0;;
            let unit: number = parseInt(delayState)/1000;
            for(let i in kws){
                if(kws[i] === "" || kws[i] === " ")continue;
                currentTime += unit;
            }
            setAppTime(currentTime);

    }

    const fetchTheToken = ()=>{
    
            const url = 'https://cse.google.com/cse.js?cx=' + cxState;
            //you can now also use https://app.converting.click/token.json
            //i set up a daily cronjob running the cse.google.com/cse.js url with a prefilled CX id https://i.imgur.com/OIUpZpV.png
            //it is refreshing the token inside the token.json file by overwriting the file, so no more CORS extension needed
            //i would have replaced the url = '' with the new one, but the other code is still using this part and i dont want to mess around
            let xhttp = new XMLHttpRequest();
            try{
            xhttp.open("GET", url,false);
                xhttp.send();
                if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                    let str : string = xhttp.responseText.split('})(')[1];
                    str = str.substr(0, str.length-2)
                    return (JSON.parse(str).cse_token);
                }
            }catch(err){console.error(err);}
    }

    const fetchNonCustomToken = ()=>{
        const url = 'https://app.converting.click/token.json';
        //you can now also use https://app.converting.click/token.json
        //i set up a daily cronjob running the cse.google.com/cse.js url with a prefilled CX id https://i.imgur.com/OIUpZpV.png
        //it is refreshing the token inside the token.json file by overwriting the file, so no more CORS extension needed
        //i would have replaced the url = '' with the new one, but the other code is still using this part and i dont want to mess around
        let xhttp = new XMLHttpRequest();
        try{
        xhttp.open("GET", url,false);
            xhttp.send();
            if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                let str : string = xhttp.responseText.split('})(')[1];
                str = str.substr(0, str.length-2)
                return (JSON.parse(str).cse_token);
            }
        }catch(err){console.error(err);}       

    }

    const saveFields = ()=>{
        setShowDomainCheckmarkSettings(true);
        setTimeout(()=>{
            setShowDomainCheckmarkSettings(false);
        },2000)
        localStorage.setItem("cx", cxState);
        localStorage.setItem("lg", lgState);
        localStorage.setItem("lr", lrState);
        localStorage.setItem("num", numState);
        localStorage.setItem("delay", delayState);

    }
    const startSearch = async ()=>{
        setWordsToBeCounted([]);
        setData({});
        setSavedTitles([]);
        setLinkCount({});
        setTitleCount({});
        setSecondViewData([{title:"",resultsCount:0}]);
        setDomainData({});
        setMetaData({})
        
        if(isLoading) {
            return;
        }
        sessionStorage.setItem('hasToStop', 'false');

        await new Promise(resolve => setTimeout(resolve, 10));
        
        setIsLoading(true);
    
            keyWords = keywordsFieldValue.split('\n');
            keyWords = keyWords.filter(s=>s!="");
            if(keyWords.length == 0){
                setIsLoading(false);
                return;
            }
            if(isCustomCX){
                token = fetchTheToken();
            }else{
                setCx("b5b62ecd198cd5065");
                token = fetchNonCustomToken();
            }

            saveFields();

            let timeToFinish = keyWords.length * parseInt(delayState)/1000;

            setTimeLeft(timeToFinish);
            setTotalKeywords(keyWords.length);

            if(searchWithDelay)
                searchWithDelay(keyWords, token, cxState, lgState, lrState, parseInt(numState), parseInt(delayState),
                (filtered: boolean)=>{
                    setFilteredByCache(filtered);
                    setIsLoading(false);
                });
    }

    const getSortedDataView1 = ()=>{
        if(sortIndex === 1)
            return Object.keys(data).sort();

        if(sortIndex === -1)
            return Object.keys(data).sort().reverse();

        if(sortIndex === 2){
            return Object.keys(data).sort((a,b)=>{
                return (data[a].length - data[b].length)
            });
        }
        if(sortIndex === -2){
                return Object.keys(data).sort((a,b)=>{
                    return (data[a].length - data[b].length)
                }).reverse();
        }
        return Object.keys(data);
    }

    const getSortedDataView3 = ()=>{

        if(sortIndex === 1){
            return secondViewData?.sort((a,b)=>{
                return b.resultsCount.toString().localeCompare(a.resultsCount.toString());
            });
        }

        if(sortIndex === -1){
            return secondViewData?.sort((a,b)=>{
                return a.resultsCount.toString().localeCompare(b.resultsCount.toString());
            });
        }
        if(sortIndex === 2){
            return secondViewData?.sort((a,b)=>{
                    return a.title.localeCompare(b.title);
            })
        }
        if(sortIndex === -2){
            return secondViewData?.sort((a,b)=>{
                return b.title.localeCompare(a.title);
            })
        }
        
        return secondViewData?.reverse();
    }

    const setSortMode = (index: number)=>{
        if(sortIndex === index){
            setSortIndex(-1 * index);
            return;
        }
        setSortIndex(index);
    }

    const getSortedDataView4 = ()=>{

        if(sortIndex === 1){
            return Object.keys(currentLinkCount).sort((a,b)=>{
                return currentLinkCount[a].length-currentLinkCount[b].length;
            })
        }
        
        if(sortIndex === -1){
            return Object.keys(currentLinkCount).sort((a,b)=>{
                return currentLinkCount[b].length-currentLinkCount[a].length;
            })
        }

        
        if(sortIndex === 2){
            return Object.keys(currentLinkCount).sort((a,b)=>{
                return a.localeCompare(b);
            })
        }
        if(sortIndex === -2){
            return Object.keys(currentLinkCount).sort((a,b)=>{
                return b.localeCompare(a);
            })
        }

        return Object.keys(currentLinkCount);
    }

    const getSortedDataView5 = ()=>{

        if(sortIndex === 1){
            return Object.keys(currentTitleCount).sort((a,b)=>{
                return currentTitleCount[a].length-currentTitleCount[b].length;
            })
        }
        
        if(sortIndex === -1){
            return Object.keys(currentTitleCount).sort((a,b)=>{
                return currentTitleCount[b].length-currentTitleCount[a].length;
            })
        }

        
        if(sortIndex === 2){
            return Object.keys(currentTitleCount).sort((a,b)=>{
                return a.localeCompare(b);
            })
        }
        if(sortIndex === -2){
            return Object.keys(currentTitleCount).sort((a,b)=>{
                return b.localeCompare(a);
            })
        }

        return Object.keys(currentTitleCount);
    }

    const applyFilters = ()=>{
        setShowDomainCheckmark(true);
        setTimeout(()=>{
            setShowDomainCheckmark(false);
        },2000)
        stopTheSearch();
        startSearch();
        stopTheSearch();
        setIsLoading(false);
    }


    const getSortedDataView6 = ()=>{

        const getNumberOfLinks = (domainData: DomainRow)=>{
            let dictionary: {[keyword: string]: boolean} = {}
        for(let i in domainData.path){
            let currentPath = domainData.path[i];
            for(let index in currentPath.keywords){
                if(dictionary[currentPath.keywords[index].keyword] === undefined){
                    dictionary[currentPath.keywords[index].keyword] = true;
                }
            }
        }
        return Object.keys(dictionary).length;
    }
    
    

        if(sortIndex === 1){
            return Object.keys(currentDomainData).sort((a,b)=>{
                return getNumberOfLinks(currentDomainData[b]) - getNumberOfLinks(currentDomainData[a]); 
            });
        }
        if(sortIndex === -1){
            return Object.keys(currentDomainData).sort((a,b)=>{
                return getNumberOfLinks(currentDomainData[a]) - getNumberOfLinks(currentDomainData[b]); 
            });
        }
        if(sortIndex === 2){
            return Object.keys(currentDomainData).sort((a,b)=>{
                return currentDomainData[b].hostName.localeCompare(currentDomainData[a].hostName);
            })
        }
        if(sortIndex === -2){
            return Object.keys(currentDomainData).sort((a,b)=>{
                return currentDomainData[a].hostName.localeCompare(currentDomainData[b].hostName);
            })
        }
        return Object.keys(currentDomainData);
        
    }

    const getSortedDataView7 = ()=>{
        if(sortIndex === 1){
         return Object.keys(metaData).sort((a,b)=>{
             return metaData[b].name.localeCompare(metaData[a].name);
         });   
        }
        if(sortIndex === -1){
            return Object.keys(metaData).sort((a,b)=>{
                return metaData[a].name.localeCompare(metaData[b].name);
            });   
        }
        if(sortIndex === 2){
            return Object.keys(metaData).sort((a,b)=>{
                return metaData[b].links.length - metaData[a].links.length;
            });   
        }
        if(sortIndex === -2){
            return Object.keys(metaData).sort((a,b)=>{
                return metaData[a].links.length - metaData[b].links.length;
            });   
        }
        return Object.keys(metaData);
    }

    return (
            <div style={{flex:'1', margin:'15pt', marginLeft:'215px', borderRadius:'30px'}}>   

        {currentView===6 && <div className="row justify-content-md-left">
                <div className="col col-lg-6">
                    <div className="heading"><label>Settings</label> <small style={{textAlign: 'right',float: 'right',padding:'5px'}}></small></div>
                    <table className="table table-slim settings">
                        <tbody>
                            <tr><td id="cxCollumn">
                            <div id="cxLabel">
                                <span>Custom Search ID (CX)</span><br />
                                { isCustomCX && <span style={{color:'red', fontWeight:"bold", fontSize:"11px"}}>You need <a target="_blank" href="https://mni.me/go/unblocker">CORS Unblocker</a> set to "On".</span>}
                            </div>
                            <div>
                                <input type="checkbox" onChange={customCXClick} checked={isCustomCX} className="toggle-switch tight" id="toggle2" />
                            </div>
                            </td>
                            <td style={(!isCustomCX)?{backgroundColor:"rgba(50,50,50,0.6)"}:{backgroundColor:"rgba(255,255,255,0.6)"}}>
                                {isCustomCX && <input disabled={isLoading===true} value={cxState} onChange={(e)=>{setCx(e.target.value);}} name="cx" /> }
                                </td>
                            </tr>
                            <tr><td><label>gl (GEO)</label></td><td><input disabled={isLoading===true} value={lgState} onChange={(e)=>{setLg(e.target.value);}}  name="lg" defaultValue={"us"} /></td></tr>
                            <tr><td><label>lr (Language)</label></td><td><input disabled={isLoading===true} value={lrState} onChange={(e)=>{setLr(e.target.value);}} name="lr" defaultValue={"lang_en"} /></td></tr>
                            <tr><td><label>num (SERP Positions)</label></td><td><input disabled={isLoading===true} value={numState} onChange={(e)=>{setNum(e.target.value);}} step="10" name="num" type="number" defaultValue={20}/></td></tr>
                            <tr><td><label>Delay between queries (ms)</label></td><td><input disabled={isLoading===true} value={delayState} onChange={(e)=>{setDelay(e.target.value);}} type="number" min="1000" max="100000"  name="speed"/></td></tr>
                        </tbody>
                    </table>
                    <Button ref={searchButton} variant="primary"
                            onClick={saveFields}
                                style={{backgroundColor:buttonColor, float:'right', margin:'2px'}}>{"Save settings"}</Button>
                 {showDomainCheckmarkSettings && <div className="midAligner">
                                <div className="success-checkmark">
                                <div className="check-icon">
                                    <span className="icon-line line-tip"></span>
                                    <span className="icon-line line-long"></span>
                                    <div className="icon-circle"></div>
                                    <div className="icon-fix"></div>
                                </div>
                            </div>
                            </div>}
                </div>
            </div>}

            {currentView===7 && <div className="row justify-content-md-left">
                <div className="col col-lg-6" style={{position: 'relative'}}>
                    <div className="heading"><label>
                        Keywords
                    </label>
                    </div>
                <textarea onChange={changeApp} value={keywordsFieldValue} disabled={isLoading===true} placeholder="Paste keywords to check in SERPs.."
                            className="form-control" style={{minHeight:"250px"}}></textarea>
                            <Button ref={searchButton} variant="primary" onClick={()=>{
                                    if(isLoading===false){setSessionResult([]);startSearch();}
                                    else{
                                        setIsLoading(false);
                                        stopTheSearch();
                                    }}
                                }
                                style={{backgroundColor:buttonColor, float:'right', margin:'2px'}}>{(isLoading)?"Cancel":"Start Processing"}</Button>

                            <Button disabled={isLoading} onClick={()=>{exportAllQueries(keywordsFieldValue.split('\n'));}} variant="primary" style={{backgroundColor:buttonColor, float:'left', margin:'2px'}}>Export</Button>
                            <Button disabled={isLoading} onClick={()=>{
                                setSessionResult([]);
                                importAllQueries((keywords:string[])=>{
                                    let str : string = "";
                                    keywords.map(el=>{
                                        str += el + "\n";
                                    });
                                    str = str.slice(0, str.length-1);

                                        setKeywordsFieldValue(str);
                                        searchButton.current.click();
                                    return {};   
                                    })
                            }} variant="primary" style={{backgroundColor:buttonColor, float:'left', margin:'2px'}}>Import</Button>
                            
                            {isLoading && 
                            <div style={{margin:'10px',marginTop:'50px'}}>
                            <p style={{width:'100%', textAlign:'center', marginBottom:"0px"}}>Time span: {Math.trunc(timeLeft/60)}m {timeLeft%60}s
                            
                            <Spinner style={{width:"20px",height:"20px",marginLeft:"10px",fontSize:"12px", }} animation="border" role="status">         </Spinner>
                            </p>

                            <ProgressBar max={totalKeywords} now={queriesDone} label={Math.trunc((queriesDone/totalKeywords)*100).toString() + '%'} variant="success" striped={true}></ProgressBar>
                            </div>
                            }
                                { !isLoading && appTime!== 0 &&<p style={{width:'100%', textAlign:'center', marginBottom:"0px", marginTop:'5px'}}>Approximate Time: {Math.trunc(appTime/60)}m {appTime%60}s</p>
                                }
                                { !isLoading && filteredByCache &&<p style={{width:'100%', textAlign:'center', marginBottom:"0px", marginTop:'5px', color:'green'}}>Filtered with cached results</p>
                                }
                <div id="feched"></div>
                <div className="midAligner">
                <span style={{color:'red', fontWeight:"bold", fontSize:"11px"}}>You need <a target="_blank" href="https://mni.me/go/unblocker">CORS Unblocker</a> set to "On".</span>
                </div>  
                </div>
            </div>}

            {currentView===8 && <div className="col col-lg-6" style={{position:'relative'}}>
                <div style={{position: 'relative'}}>
                <div className="heading" style={{display:'flex', justifyContent:'space-between'}}>
                    <label>Domains</label>
                </div>
                <textarea placeholder="Type your domains in here.." value={filterDomains} onChange={(e)=>{
                        setFilterDomains(e.currentTarget.value);
                }}
                            className="form-control" style={{minHeight:"250px"}}></textarea>
                </div>

                <Form style={{justifyContent:"space-around",marginBottom:"10px"}}>
                            <Form.Check
                                type={"checkbox"}
                                label={`Show only selected domains`}
                                checked = {showOnlyDomains}
                                id="showdomains"
                                readOnly={true}
                                onClick={()=>setShowOnlyDomains(true)}
                            />
                             <Form.Check
                                type={"checkbox"}
                                label={`Hide selected domains`}
                                checked = {!showOnlyDomains}
                                id="dontshowdomains"
                                readOnly={true}
                                onClick={()=>setShowOnlyDomains(false)}
                            />
                    </Form>
                <Form >
                            <Form.Check onClick={()=>{if(isLoading===false)setEliminateStopWords(!eliminateStopWords)}}
                                type={"checkbox"}
                                label={`Elimiate stop words (to,is,and..)`}
                                checked = {eliminateStopWords}
                                id="eliminatestopwords"
                                readOnly={true}
                            />
                             <Form.Check onClick={()=>{if(isLoading===false)setEliminateSymbols(!eliminateSymbols)}}
                                type={"checkbox"}
                                label={`Eliminate characters (%$"/&..)`}
                                id="eliminatecharacters"
                                checked = {eliminateSymbols}
                                readOnly={true}
                            />
                    </Form>
                    <Button ref={searchButton} variant="primary"
                            onClick={applyFilters}
                                style={{backgroundColor:buttonColor, float:'right', margin:'2px'}}>{"Apply filters"}</Button>
                            {showDomainCheckmark && <div className="midAligner">
                                <div className="success-checkmark">
                                <div className="check-icon">
                                    <span className="icon-line line-tip"></span>
                                    <span className="icon-line line-long"></span>
                                    <div className="icon-circle"></div>
                                    <div className="icon-fix"></div>
                                </div>
                            </div>
                            </div>}
                            

                
            </div>}

                <Table className="pure-table">
                    <thead>
                       {currentView===0 && <tr>
                        <th onClick={()=>{setSortMode(2)}} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}> 
                        <div className="thHolder">
                            <span>Count</span>
                        {sortIndex === 2 && increasingSortIcon}
                        {sortIndex === -2 && decreasingSortIcon}
                        </div>
                        </th>
                        <th style={{textAlign:"left", padding:"0.2rem"}}onClick={()=>{setSortMode(1)}}>
                            <div className="thHolder">
                                <span>Titles (split into single words)</span>
                                {sortIndex === 1 && increasingSortIcon}
                                {sortIndex === -1 && decreasingSortIcon}
                            </div>
                        </th>
                        </tr>}
                        {currentView===1 && <tr> 
                        <th onClick={()=>{setSortMode(1)}} style={{width:"200px",textAlign:"left", padding:"0.2rem"}}> 
                            <div className="thHolder">
                                <span>Results</span>
                                {sortIndex === 1 && increasingSortIcon}
                                {sortIndex === -1 && decreasingSortIcon}
                            </div>
                        </th>
                        <th style={{textAlign:"left", padding:"0.2rem"}}onClick={()=>{setSortMode(2)}}>

                        <div className="thHolder">
                                <span>Search term (from input)</span>
                                {sortIndex === 2 && increasingSortIcon}
                                {sortIndex === -2 && decreasingSortIcon}
                            </div>

                        </th>
                        </tr>
                        }
                        {currentView===2 && <tr>
                        <th onClick={()=>{setSortMode(1)}} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}>

                        <div className="thHolder">
                                <span>Keywords</span>
                                {sortIndex === 1 && increasingSortIcon}
                                {sortIndex === -1 && decreasingSortIcon}
                            </div>

                        </th>
                        <th style={{textAlign:"left", padding:"0.2rem"}} onClick={()=>{setSortMode(2)}}>

                        <div className="thHolder">
                                <span>SERP URLs</span>
                                {sortIndex === 2 && increasingSortIcon}
                                {sortIndex === -2 && decreasingSortIcon}
                            </div>

                        </th>
                        </tr>}
                        {currentView===3 && <tr>
                        <th onClick={()=>{setSortMode(1)}} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}>

                        <div className="thHolder">
                                <span>Count</span>
                                {sortIndex === 1 && increasingSortIcon}
                                {sortIndex === -1 && decreasingSortIcon}
                            </div>

                        </th>
                        <th style={{textAlign:"left", padding:"0.2rem"}} onClick={()=>{setSortMode(2)}}>

                        <div className="thHolder">
                                <span>URL Titles</span>
                                {sortIndex === 2 && increasingSortIcon}
                                {sortIndex === -2 && decreasingSortIcon}
                            </div>

                        </th>
                        </tr>}
                        {currentView===4 && <tr>
                            <th onClick={()=>{setSortMode(1)}} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>KW/URL</span>
                                        {sortIndex === 1 && increasingSortIcon}
                                        {sortIndex === -1 && decreasingSortIcon}
                                </div>
                            </th>
                        
                            <th onClick={()=>{setSortMode(2)}} style={{width:"25vw",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>Domain</span>
                                        {sortIndex === 2 && increasingSortIcon}
                                        {sortIndex === -2 && decreasingSortIcon}
                                </div>
                            </th>
                        <th style={{width:"25vw",textAlign:"left", padding:"0.2rem"}}>Titles (unique terms combined)</th>
                        </tr>}


                        {currentView===5 && <tr>
                            <th onClick={()=>{setSortMode(1)}} style={{width:"10vw",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>META Name</span>
                                        {sortIndex === 1 && increasingSortIcon}
                                        {sortIndex === -1 && decreasingSortIcon}
                                </div>
                            </th>
                            <th onClick={()=>{setSortMode(2)}} style={{width:"80px",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>Count</span>
                                        {sortIndex === 2 && increasingSortIcon}
                                        {sortIndex === -2 && decreasingSortIcon}
                                </div>
                            </th>
                            <th onClick={()=>{setSortMode(3)}} style={{width:"25vw",textAlign:"left", padding:"0.2rem"}}>
                                <div className="thHolder">
                                    <span>Description</span>
                                </div>
                            </th>
                        </tr>}
                    </thead>
                    <tbody>
                    {currentView===0 && getSortedDataView1().map((el,index)=>
                    <React.Fragment key={index}>
                        <UserTableRow data={data} index={el}></UserTableRow>
                    </React.Fragment>)
                    }
                    {currentView===1 && getSortedDataView3()?.map((el,index)=>
                        <ResultCountRow key={index} title={el.title} totalResults={el.resultsCount}></ResultCountRow>
                        )}
    
                    {currentView===2 && currentLinkCount && getSortedDataView4().map((el,index)=>
                        <React.Fragment key={index}>
                            <UserTableRowLinkCount currentKeywords={currentLinkCount[el]} currentLink={el}></UserTableRowLinkCount>
                        </React.Fragment>)
                    }
                     {currentView===3 && currentTitleCount && getSortedDataView5().map((el,index)=>
                        <React.Fragment key={index}>
                            <UserTableRowLinkCount currentKeywords={currentTitleCount[el]} currentLink={el} viewNumber={3}></UserTableRowLinkCount>
                        </React.Fragment>)
                    }
                    {currentView===4 && getSortedDataView6().map((el,index)=>
                          <React.Fragment key={index}>
                              <DomainGroupRow domainData={currentDomainData[el]}></DomainGroupRow>
                          </React.Fragment>
                    )
                    }

                    {currentView===5 && getSortedDataView7().map((el,index)=>
                          <React.Fragment key={index}>
                              <MetaGroupRow metaData={metaData[el]}></MetaGroupRow>
                          </React.Fragment>
                    )
                    }
                    </tbody>
                </Table>
                {currentView===9 && <CountWordsComponent data={wordsToBeCounted}></CountWordsComponent>}

                {currentView===10 && <KeywordShitterComponent lg={lgState} lr={lrState}></KeywordShitterComponent>}

                {currentView===11 && <KeywordManager></KeywordManager>}
                
                {currentView===12 && <WelcomeScreen></WelcomeScreen>}
                {currentView===13 && <UrlWordCount></UrlWordCount> }
             </div>
            
          );


}
