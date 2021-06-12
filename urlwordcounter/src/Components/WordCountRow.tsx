import React from 'react'

type WordCountSimplified = {
    freq: number,
    word: string
}

export default function WordCountRow(props: WordCountSimplified) {
    const {word, freq} = props;

    return (
        <>
            { word !== "" && <tr style={{backgroundColor:"rgba(255,255,255,1)"}}>
                    <td style={{textAlign:"left", padding:"0.2rem"}}>{word}</td>
                    <td style={{textAlign:"left", padding:"0.2rem"}}>{freq}</td></tr>
            }
        </>
    )
}
