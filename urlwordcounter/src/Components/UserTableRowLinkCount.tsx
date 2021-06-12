import React, {useState} from 'react'
import { Collapse } from 'react-collapse';
import { Table } from 'react-bootstrap'


type Props = {
    currentLink: string,
    currentKeywords: string[],
    viewNumber? : number
}

export default function UserTableRowLinkCount(props: Props) {
    const {currentLink, currentKeywords} = props;

    const [opened, setOpened] = useState(false);
    return (
        <>
        <tr style={(opened)?{backgroundColor:"rgba(240,240,240,1)"}:{backgroundColor:"rgba(255,255,255,1)"}} onClick={()=>setOpened(!opened)}>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{currentKeywords.length}</td>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{currentLink}</td></tr>
          <tr>
              {opened && <td style={{margin:"0px", padding:"0px", textAlign:"left"}} colSpan={2}>

        <table style={{padding:'0px', width:'100vw'}}>
            <tbody>
                <tr>
                    <th style={{backgroundColor:"rgba(240,240,240,1)", textAlign:"left", padding:"0.2rem"}}>{(props.viewNumber === 3)?"Links":"Keywords"}</th>
                </tr>
                {  opened && currentKeywords.map((item,ind)=>
                <tr style={{backgroundColor:"rgba(240,240,240,1)", fontSize:"12px"}} key={ind}>
                    <td style={{textAlign:"left", padding:"0.2rem"}}>    
                         {props.viewNumber === 3 && <a href={item} target="_blank">{item}</a>}
                         {props.viewNumber !== 3 && <span>{item}</span>}
                     </td>
                    </tr>)
            }    
                  
            </tbody>
         </table>
              </td>}
          </tr>
        </>
    )
}
