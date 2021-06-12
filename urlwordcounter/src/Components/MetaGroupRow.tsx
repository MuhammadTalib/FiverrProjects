import React, {useState} from 'react'

export type MetadataLink = {
    link :string
    content?: any
}
export type MetadataRow = {
    name: string,
    description: string,
    links: MetadataLink[]
}

export type MetadataType = {[name: string]: MetadataRow}

//TO DO :props
type Props = {
    metaData: MetadataRow
}

export function MetaGroupRow(props: Props) {
    const {metaData} = props;
    const [opened, setOpen] = useState(false);

    const expand = ()=>{
        setOpen(!opened);
    }
    
    return (
        <>
        <tr style={(opened)?{backgroundColor:'rgba(240,240,240,1)'}:{}} onClick={expand}>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{metaData.name}</td>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{metaData.links.length}</td>
            <td style={{textAlign:"left", padding:"0.2rem"}}>{metaData.description}</td>
        </tr>
        <tr>

{opened && <td colSpan={3} style={{margin:"0px", padding:"0.2rem"}}>

  <table style={{padding:'0px', margin:'0px', width:'100vw', fontSize:'12px'}}>
      <tbody>
          <tr>
              <th style={{backgroundColor:"rgba(240,240,240,1)", width:'50vw', padding:"0.2rem"}}>Link</th>
              <th style={{backgroundColor:"rgba(240,240,240,1)", padding:"0.2rem"}}>Content</th>
          </tr>
              {metaData.links.map((item,ind)=>
             <React.Fragment key={ind}>
                 <tr style={{backgroundColor:"rgba(240,240,240,1)"}}>
                     <td style={{padding:"0.2rem"}}>
                         <a target={"_blank"} href={item.link}>{item.link}</a>
                     </td>
                    <td style={{padding:"0.2rem"}}>
                     <span>{item.content}</span>
                    </td>
                </tr>
             </React.Fragment>)}    
          
       </tbody>
  </table>
      </td>} 

    </tr>
        
        </>


    )
}
