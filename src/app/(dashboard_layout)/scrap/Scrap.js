import React, { useState } from "react"
import { firebaseModel } from "../firebase/firebase.model"
import Layout from "../components/global/layout"
import loader from '../methods/loader';
import { toast } from "react-toastify";

const ScrapPage = () => {
    const tables = [
        { id: 'categories', name: 'Categories' },
        { id: 'code', name: 'Code' },
        { id: 'html', name: 'Html' },
        { id: 'blogs', name: 'Blogs' },
        { id: 'dictionary', name: 'Dictionary' },
    ]
    const [scrapData, setScrapData] = useState([])
    const [table, setTable] = useState('')
    const [text, setText] = useState('')
    const [tab, setTab] = useState('export')
    const [notAdded, setNotAdded] = useState([])

    const tableChange = async (e) => {
        setTable(e)

        if(tab=='export' && e){
            loader(true)
            
        }
        
    }


    const tabChange = (e) => {
        setTab(e)
        setTable('')
        setText('')
        setScrapData([])
    }

    const copy = () => {
        let url = JSON.stringify(scrapData)
        navigator.clipboard.writeText(url);
        toast.success('Copyed')
    }

    const importData=async()=>{
        if(!text || !table) return
        let scrap=JSON.parse(text)

        loader(true)
        let res=[]
        let categoryError=[]
        for await (let itm of scrap) {
            let name=itm?.name||itm.title
            if(itm.category){
                const afunction= async()=>{
                    await firebaseModel.firestore().collection('categories').where('scrapId','==',itm.category).get().then(res => {
                        let fres = res.docs.map(itm => {
                            return {
                                ...itm.data(),
                                id: itm.id
                            }
                        })
                        if(fres.length){
                            itm.category=fres[0].id
                        }else{
                            itm.category=''
                        }
                    }, err => {
                        categoryError.push(itm)
                        localStorage.setItem('categoryError',JSON.stringify(notAdded))        
                        console.error(`category err - ${name}`, err)
                    })
                }
               await afunction()
            }

            res.push({...itm,date:new Date().toISOString()})
          }

        //   return
          res.map(ritm=>{
            let name=ritm?.name||ritm.title
            firebaseModel.firestore().collection(table).add(ritm).then(fres=>{
            },err=>{
                notAdded.push(ritm)
                localStorage.setItem('notAdded',JSON.stringify(notAdded))
                console.error(`add err - ${name}`, err)
            })
          })
          loader(false)
    }

    const writeFile=()=>{
        const link = document.createElement("a");
        let jsondata={
            table:table,
            data:scrapData
        }

        const content = JSON.stringify(jsondata);
        const file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        let datetime=new Date().toISOString()
        link.download = `mohitk-art-${table}-${datetime}.backup`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function isJsonString(str) {
        if(!str) return true
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    const readFile=(e)=>{
        let files=e.target.files
        var fr=new FileReader(); 
            fr.onload=function(){ 
                let result=fr.result
                if(isJsonString(result)){
                    let jsondata=JSON.parse(result)
                    setTable(jsondata.table)
                    setText(JSON.stringify(jsondata.data))
                }else{
                    setText('')
                    setTable('')
                }
            } 
              
            fr.readAsText(files[0]); 
    }

    return <>
        <Layout>
            <div className="container py-4">
                
                <ul class="nav nav-tabs mb-3">
                    <li class="nav-item">
                        <a class={`nav-link ${tab == 'export' ? 'active text-blue-500' : ''}`} onClick={e => tabChange('export')}>Export</a>
                    </li>
                    <li class="nav-item">
                        <a class={`nav-link ${tab == 'import' ? 'active text-blue-500' : ''}`} onClick={e => tabChange('import')}>Import</a>
                    </li>
                </ul>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <select className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2" value={table} disabled={tab=='import'?true:false} onChange={e => tableChange(e.target.value)}>
                            <option value="">Select Table</option>
                            {tables.map(itm => {
                                return <option value={itm.id}>{itm.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-4">
                        
                        {tab=='import'?<>
                        <button className="btn btn-primary mr-2" onClick={importData}>Import</button>
                        <label className="btn btn-primary mb-0">
                            <input type="file" onChange={readFile} className="d-none" />
                            Upload
                        </label>
                        </>:<>
                        <button className="btn btn-primary mr-1" onClick={copy}>Copy</button>
                        <button onClick={writeFile} className="btn btn-primary">Backup download</button>
                        </>}
                        
                    </div>
                </div>
                <textarea className="relative shadow-box bg-white w-full rounded-lg h-[150px] flex items-center gap-2 overflow-hidden px-2" disabled={true} onChange={e => setText(e.target.value)} value={text}></textarea>


            </div>
        </Layout>
    </>
}

export default ScrapPage