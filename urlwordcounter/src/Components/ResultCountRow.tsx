import React, {useState, useEffect} from 'react'
import { Collapse } from 'react-collapse';
import { Table } from 'react-bootstrap'

type Props = {
    totalResults : number,
    title: string
}

export default function UserTableRow(props : Props) {
    const {totalResults, title} = props;

    return (
        <>
        { title!=="" && <tr style={{backgroundColor:"rgba(255,255,255,1)"}}>
                <td style={{textAlign:"left", padding:"0.2rem"}}>{totalResults}</td>
                <td style={{textAlign:"left", padding:"0.2rem"}}>{title}</td></tr>
            }
    </>
    )
}