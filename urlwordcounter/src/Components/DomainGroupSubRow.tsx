import { POINT_CONVERSION_COMPRESSED } from 'constants';
import React, { useState } from 'react'
import {Path} from './DomainGroupRow'

type Props = {
    path : Path
    domain: string
}
export default function DomainGroupSubRow(props: Props) {
    const [opened, setOpened] = useState(false);

    const {keyWordNumber, path, title} = props.path;
    const selectedColor = 'rgba(220,220,220,1)';
    return (
        <>
            <tr style={(opened)?{backgroundColor:selectedColor}:{backgroundColor:"rgba(240,240,240,1)"}} onClick={()=>setOpened(!opened)}>
                                <td style={{width:'15vw', padding:"0.2rem"}}>{props.path.keywords.length + " Keywords"}</td>
                                <td style={{padding:"0.2rem"}}><a target='_blank' href={'//' + props.domain + props.path.path}>{path}</a></td>
                                <td style={{padding:"0.2rem"}}>{title}</td>
            </tr>
            <tr>
             {opened && <td style={{margin:"0px", padding:"0px", fontSize:"12px"}} colSpan={3}>
                    <table style={{padding:'0px', width:'100vw'}}>
                        <tbody>
                            <tr style={{backgroundColor:selectedColor}}>
                                <th style={{width:'10vw', textAlign:'left', padding:"0.2rem"}}>Position</th>
                                <th style={{width:'20vw', textAlign:'left', padding:"0.2rem"}}>Keyword</th>
                                <th style={{padding:"0.2rem"}}>Description</th>
                            </tr>
                            
                            { props.path.keywords.map((item,ind)=>
                            <tr style={{backgroundColor:selectedColor}} key={ind}>
                                <td style={{padding:"0.2rem"}}>{item.position}</td>
                                <td style={{padding:"0.2rem"}}>{item.keyword}</td>
                                <td style={{padding:"0.2rem"}}>{item.description}</td>
                                </tr>)
                        }    
                            
            </tbody>
         </table>
              </td>}    
            </tr>
        </>
    )
}
