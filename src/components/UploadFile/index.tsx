import React, { useEffect, useRef } from "react";
import { useState } from "react";
import "./style.css";
import FireApi from "@/utils/firebaseApi.utils";
import { loaderHtml } from "@/utils/shared";
import AudioHtml from "../AudioHtml";
import VideoHtml from "../VideoHtml";
import imageModel from "@/utils/image.model";
type Props ={
    multiple?:boolean
    modal:string
    type?:'image'|'audio'|'video'|'doc'
    label:string
    accept?:string
    value:any
    result:({value}:{value:any})=>void
}
const UploadFile= ({ multiple = false, modal = 'default', type = 'image', label = 'Upload', accept = 'image/*', value = '', result = () => { } }:Props) => {
    const [image, setImage] = useState<any>()
    const {imageUploads,isLoading:loading,deleteFile}=FireApi()
    
    const inputElement = useRef<any>(null)
    const uploadImage = (e:any) => {
        const files = e.target.files
        imageUploads(modal,files).then((res:any)=>{
            if(res.success){
                let v
                if(multiple){
                    v=res?.data?.map((itm:any)=>itm.fullPath)
                }else{
                    v=res?.data?.[0]?.fullPath
                }
                result({
                    value:v
                })
            }
        }).finally(()=>{
            if(inputElement.current) inputElement.current.value=''
        })
    }

    const remove = (img:string) => {
        loaderHtml(true)
        deleteFile(img).then(res=>{
            if(res.success){
                
            }
        }).finally(()=>{
               loaderHtml(false)
               let v=''
               if(multiple){
                    v=image.filter((itm:any)=>itm!=img)
               }
               setImage(v)
            result({value:v})
        })
    }

    useEffect(() => {
        if(value!=image){
            let v
            if(multiple){
                v=value.map((itm:any)=>{
                    const i=itm.split('/')
                    let v=`assets/${modal}/${itm}`
                    if(i.length>1) v=itm
                    return v
                })
            }else{
                const i=value.split('/')
                v=`assets/${modal}/${value}`
                if(i.length>1) v=value
            }
            setImage(v)
        }
    }, [value])

    return <>
        {!multiple && image ? <>
           
        </> : <>
         <label className={`inline-block cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${image && !multiple ? 'hidden' : ''}`}>
                <input type="file" className="hidden" ref={inputElement} accept={accept} multiple={multiple ? true : false} disabled={loading} onChange={(e) => { uploadImage(e); }} />
                {label || 'Upload Image'}
            </label>
        </>}
            
        <div>
 {loading ? <div className="text-green-500">Uploading...</div> : <></>}
        {multiple ? <>
            <div className="imagesRow">
                {image && image.map((itm:any,i:any) => {
                    return <div className="imagethumbWrapper" key={i}>
                        {type == 'audio' ? <>
                            <AudioHtml src={imageModel.getImage(itm)} />
                        </> : <></>}
                        {type == 'video' ? <>
                            <VideoHtml src={imageModel.getImage(itm)} />
                        </> : <></>}
                        {type == 'image' ? <>
                            <img src={imageModel.getImage(itm)} className="thumbnail" />
                        </> : <></>}
                       <span className="material-symbols-outlined cursor-pointer text-lg text-red-500 absolute right-[-10px] top-[-10px]" title="Remove" onClick={() => remove(itm)}>close</span>
                    </div>
                })}
            </div>
        </> : <>
            {image ? <div className="imagethumbWrapper">
                {type == 'audio' ? <>
                    <AudioHtml src={imageModel.getImage(image)} />
                </> : <></>}
                {type == 'video' ? <>
                    <VideoHtml src={imageModel.getImage(image)} />
                </> : <></>}
                {type == 'image' ? <>
                    <img src={imageModel.getImage(image)} className="thumbnail" />
                </> : <></>}
                <span className="material-symbols-outlined cursor-pointer text-lg text-red-500 absolute right-[-10px] top-[-10px]" title="Remove" onClick={() => remove(image)}>close</span>
                <a href={imageModel.getImage(image)} className="d-block" target="_blank">View and download</a>
            </div> : <></>}
        </>}
        </div>
       
    </>
}

export default UploadFile