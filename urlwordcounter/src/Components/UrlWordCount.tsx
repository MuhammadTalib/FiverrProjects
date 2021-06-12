import React, {useState} from 'react'
import "./UrlWordCount.css"
import { Button, Table, Spinner } from 'react-bootstrap';

// import LinearProgress from '@material-ui/core/LinearProgress';
import 'bootstrap/dist/css/bootstrap.min.css'
import ProgressBar from 'react-bootstrap/ProgressBar'


// interface Props {
//     products: string[];
// }
// interface State {
//     urls:{ [key: string]: any }, 
//     tableData:{ [key: string]: any }
//     // quantities: { [key: string]: number };
// }

export interface Props {
    
}
 
export interface State {
    urls:{ [key: string]: any }, 
    tableData:{ [key: string]: any },
    buffer: any,
    progress: any
}
 
class UrlWordCount extends React.Component<Props, State> {
    state = { 
        urls:[], 
        tableData:[],
        buffer:0,
        progress:0
    }
//     render() { 
//         return (  );
//     }
// }
 
// export default UrlWordCount;

// class UrlWordCount extends React.Component<Props, State> {

//     state: Readonly<State> = { 
//         urls:[], 
//         tableData:[]  
//     }

    splitUrls=(e:any):any=>{
        this.setState({urls: e.target.value.split('\n')})
    }

    startScanning= async ()=>{
        console.log("windoe", window)
        this.setState({
            tableData:[], 
            buffer: this.state.urls.length,
            progress: 0
        });

        for(let i=0; i<this.state.urls.length; i++){
            let fetchData : any= {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body :  JSON.stringify({URL : this.state.urls[i]})
            }
            fetch("http://localhost:4000/getdata", fetchData)
            .then(blob => blob.json())
            .then((data:any) => {
                this.setState({progress: this.state.progress+1})
                console.log("data: ", data)
                let d:any= {count:data.count, url:data.url}
                // console.log("tableData",tableData)
                let tab:any[] = this.state.tableData
                tab.push(d)
                this.setState({tableData: tab})
                // setTableData(tab)
              })
            .catch(err => console.log("err: ", err));
        }
    }

    render() { 
        return ( <>
            <div className="mainDivUrlCount">
                <div className = "headOfURLs">URLs</div>
                <textarea onChange={this.splitUrls} className="textAreaURLCount"></textarea>
            </div>
            <div className="notice">You need <span className="ntice-span">CORS Unblocker</span> set to "On"</div>
            <Button onClick={this.startScanning} className="startScanning" style={{backgroundColor:"rgb(25, 24, 24)"}}>Start Scanning</Button>
            {/* {this.state.buffer && <LinearProgress variant="buffer" value={(this.state.progress/this.state.buffer)*100} valueBuffer={100} />} */}
            {this.state.buffer && 
                <div style={{margin:'10px',marginTop:'50px'}}>
                <ProgressBar max={this.state.buffer} now={this.state.progress} label={Math.trunc((this.state.progress/this.state.buffer)*100).toString() + '%'} variant="success" striped={true}></ProgressBar>
                </div>
            }
            <Table className="pure-table">
                <thead>
                    <tr>
                        <th  style={{width:"120px",textAlign:"left", padding:"0.2rem"}}> 
                        <div className="thHolder">
                            <span>Word Count</span>
                        </div>
                        </th>
                        <th style={{textAlign:"left", padding:"0.2rem"}}>
                            <div className="thHolder">
                                <span>URL</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.tableData && this.state.tableData.map((m:any,index: React.Key | null | undefined)=>{
                        return <tr key={index}>
                        <th  style={{width:"120px",textAlign:"left", padding:"0.2rem"}}> 
                        <div className="thHolder">
                            <span>{m.count}</span>
                        </div>
                        </th>
                        <th style={{textAlign:"left", padding:"0.2rem"}}>
                            <div className="thHolder">
                                <span>{m.url}</span>
                            </div>
                        </th>
                    </tr>
                    })}

                
                </tbody>
            </Table>
        </> );
    }
}
 
export default UrlWordCount;

// export default function UrlWordCount() {
    // const [urls, setUrls] = useState([]);
    // const [tableData, setTableData] = useState(null)

    // function splitUrls(e:any):any{
    //     setUrls(e.target.value.split('\n'))
    // }

    // const startScanning= async ()=>{
    //     await setTableData(null)
    //     for(let i=0;i<urls.length;i++){
    //         let fetchData : any= {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body :  JSON.stringify({URL : urls[i]})
    //         }
    //         fetch("http://localhost:4000/getdata", fetchData)
    //         .then(blob => blob.json())
    //         .then((data:any) => {
    //             console.log("data: ", data)
    //             let d:any= {count:data.count, url:data.url}
    //             console.log("tableData",tableData)
    //             let tab = tableData? tableData : []
    //             tableData.push(d)
    //             console.log("tab1",tab)
    //             tab.push(d)
    //             console.log("tab", tab, tab.length)
    //             setTableData(tab)
    //           })
    //         .catch(err => console.log("err: ", err));
    //     }
        

        // fetch("/getdate", {
        //     method: "get"            
        // })
        // .then(function(blob: any) {
        //     console.log("res",blob)
        //     return blob.json()
        // })
        // .then(function(body: any) {
        //     // console.log("body",urls[0],"|", body,"|")

        // });
//     }
//     return (
//         <>
//             <div className="mainDivUrlCount">
//                 <div className = "headOfURLs">URLs</div>
//                 <textarea onChange={splitUrls} className="textAreaURLCount"></textarea>
//             </div>
//             <div className="notice">You need <span className="ntice-span">CORS Unblocker</span> set to "On"</div>
//             <Button onClick={startScanning} className="startScanning" style={{backgroundColor:"rgb(25, 24, 24)"}}>Start Scanning</Button>

//             <Table className="pure-table">
//                 <thead>
//                     <tr>
//                         <th  style={{width:"120px",textAlign:"left", padding:"0.2rem"}}> 
//                         <div className="thHolder">
//                             <span>Word Count</span>
//                         </div>
//                         </th>
//                         <th style={{textAlign:"left", padding:"0.2rem"}}>
//                             <div className="thHolder">
//                                 <span>URL</span>
//                             </div>
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tableData && tableData.map((m:any,index: React.Key | null | undefined)=>{
//                         return <tr key={index}>
//                         <th  style={{width:"120px",textAlign:"left", padding:"0.2rem"}}> 
//                         <div className="thHolder">
//                             <span>{m.count}</span>
//                         </div>
//                         </th>
//                         <th style={{textAlign:"left", padding:"0.2rem"}}>
//                             <div className="thHolder">
//                                 <span>{m.url}</span>
//                             </div>
//                         </th>
//                     </tr>
//                     })}

                
//                 </tbody>
//             </Table>
//         </>
//     )
// }
