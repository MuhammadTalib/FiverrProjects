import React, {useState} from 'react'
import { Collapse } from 'react-collapse';
import { Table } from 'react-bootstrap'

type Props = {
    data : { [key: string] : string[][]; },
    index: string
}

export default function UserTableRow(props : Props) {

    const {data, index} = props;

    const [opened, setOpened] = useState(false);

    return (
        <>
        <tr style={(opened)?{backgroundColor:"rgba(240,240,240,1)"}:{backgroundColor:"rgba(255,255,255,1)"}} onClick={()=>setOpened(!opened)}>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{data[index].length}</td>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{index}</td></tr>
          <tr>
              {opened && <td style={{margin:"0px", padding:"0px"}} colSpan={2}>

        <table style={{padding:'0px', width:'100vw'}}>
            <tbody>
                <tr>
                    <th style={{backgroundColor:"rgba(240,240,240,1)", textAlign:"left", padding:"0.2rem"}}>Title</th>
                    <th style={{backgroundColor:"rgba(240,240,240,1)", textAlign:"left", padding:"0.2rem"}}>Url</th>
                </tr>
                {  opened && data[index].map((item,ind)=>
                <tr style={{backgroundColor:"rgba(240,240,240,1)", fontSize:"12px"}} key={ind}>
                    <td style={{textAlign:"left", padding:"0.2rem"}}>    
                         {item[0]}
                     </td>
                     <td style={{textAlign:"left", padding:"0.2rem"}}>    
                        <a target='_blank' href={item[1]}>{item[1]}</a>
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