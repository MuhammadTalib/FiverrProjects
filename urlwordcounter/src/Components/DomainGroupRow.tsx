import React, {useState} from 'react'
import { Collapse } from 'react-collapse';
import { Table } from 'react-bootstrap'
import DomainGroupSubRow from './DomainGroupSubRow'
import { domain } from 'process';

type Props = {
    domainData : DomainRow
}
export type Path = {
    path : string,
    title : string,
    keyWordNumber : number,
    keywords : Keyword[]
}
type Keyword = {
    position: number,
    keyword : string,
    description: string
}
export type DomainRow = {
    linkNumber: number,
    keywordNumber: number,
    hostName : string,
    allKeyWords: string[],
    path: Path[]
};

export default function DomainGroupRow(props: Props) {
    const [opened, setOpened] = useState(false);
    const {domainData} = props;

    let dictionary: {[keyword: string]: boolean} = {}
    for(let i in domainData.path){
        let currentPath = domainData.path[i];
        for(let index in currentPath.keywords){
            if(dictionary[currentPath.keywords[index].keyword] === undefined){
                dictionary[currentPath.keywords[index].keyword] = true;
            }
        }
    }

    domainData.keywordNumber = (Object.keys(dictionary).length);

    return (
        <>
       <tr style={(opened)?{backgroundColor:"rgba(240,240,240,1)"}:{backgroundColor:"rgba(255,255,255,1)"}} onClick={()=>setOpened(!opened)}>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{domainData.keywordNumber + '/' + domainData.path.length}</td>
            <td style={{textAlign:"left", padding:"0.2rem"}}><a target='_blank' href={'//' + domainData.hostName} >{domainData.hostName}</a></td>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{domainData.allKeyWords.join(', ').slice(0,500) + ((domainData.allKeyWords.join(', ').length>300)?"...":"")}</td>
        </tr>
        
        <tr>

          {opened && <td colSpan={3} style={{margin:"0px", padding:"0.2rem"}}>

            <table style={{padding:'0px', margin:'0px', width:'100vw'}} className="pure-table">
                <tbody>
                    <tr>
                        <th style={{backgroundColor:"rgba(240,240,240,1)", padding:"0.2rem"}}>Keywords</th>
                        <th style={{backgroundColor:"rgba(240,240,240,1)", padding:"0.2rem"}}>Path</th>
                        <th style={{backgroundColor:"rgba(240,240,240,1)", padding:"0.2rem"}}>Title</th>
                    </tr>
                        {domainData.path.map((item,ind)=>
                       <React.Fragment key={ind}>
                           <DomainGroupSubRow path={item} domain={domainData.hostName}></DomainGroupSubRow>
                       </React.Fragment>)}    
                    
                 </tbody>
            </table>
                </td>} 

              </tr>

        </>
    )
}
