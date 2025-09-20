'use client'
import { fire } from "@/components/Swal"
import envirnment from "@/envirnment"
import { FirestoreConditions } from "@/utils/firebase.utils"
import FireApi from "@/utils/firebaseApi.utils"
import { loaderHtml } from "@/utils/shared"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import RecordingDetail from "./RecordingDetail"
import datepipeModel from "@/utils/datepipemodel"

type FilterType = {
    search?: any,
    category?: any
}

export default function ScreenRecording() {
  const table = 'recording'
  const user = useSelector((state: any) => state.user.data)
  const model = `recording/${user.id}`
  const query=useSearchParams()
  const router=useRouter()
  const navigate = (p='')=>{
    router.push(p)
  }
  const [data, setData] = useState<any>([])
  const { get, isLoading: listLoading } = FireApi()
  const { post, isLoading: postLoading,deleteApi } = FireApi()
  const { imageUploads, isLoading: fileLoading,deleteFile } = FireApi()

  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const mediaRecorder = useRef<any>(null)
  const recordedChunks = useRef<any[]>([]);



  const [filters, setFilter] = useState<FilterType>({ category: query.get('category'), search: query.get('search') })
  const getData = async () => {
    const conditions: FirestoreConditions[] = [
      {
        field: 'addedBy',
        operator: '==',
        value: user.id
      }
    ]
    const res = await get(table, conditions)
    let data = []
    if (res.data) {
      data = res.data
    }
    setData(data)
  }

  useEffect(() => {
    if (user) {
      getData()
    }
  }, [])

  const copyItem = (item: any) => {
    const url = `${envirnment.frontUrl}screen-recording/${item.file || item.name}`
    navigator.clipboard.writeText(url);
    toast.success("Url Copied")
  }


  const startRecording = async () => {
    try {
      setVideoUrl('');

      // Get screen video and (possibly) system audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Automatically stop recording if screen sharing is turned off
      stream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      let combinedStream;

      try {
        // Try to get microphone audio
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Combine screen stream and microphone audio
        combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
      } catch (audioError) {
        console.warn("Microphone not available. Proceeding with screen video only.");
        // Fallback to just screen stream (which might have system audio)
        combinedStream = stream;
      }

      mediaRecorder.current = new MediaRecorder(combinedStream, {
        mimeType: "video/webm; codecs=vp9,opus",
      });

      recordedChunks.current = [];

      mediaRecorder.current.ondataavailable = (event: any) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        setVideoUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };



  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const shareLink = () => {
    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    const filename = `_share.webm`
    const formData = new FormData();
    formData.append('file', blob, filename);
    // const res = await ApiClient.postFormData('upload/video', formData)
    const file = formData.get('file')
    loaderHtml(true)
    imageUploads(model, [file]).then((res:any) => {
      if (res.success) {
        const image = res.data[0]
        post(table, { file: image.name, url: image.url, fullPath: image.fullPath, title: '' }).then(res => {
          if (res.success) {
            navigate(`/screen-recording/${image.name}`)
          }
          loaderHtml(false)
        })
      } else {
        loaderHtml(false)
      }
    })
  }

    const deleteItem = (item:any) => {
    fire({
      title: "Do you want to delete this recording?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        loaderHtml(true)
        deleteApi(table,item.id).then(res => {
          if (res.success) {
            let arr=[...data]
            arr=arr.filter(itm=>itm.id!=item.id)
           setData(arr)
          }
          loaderHtml(false)
        })
        deleteFile(item.fullPath).then(res => { })
      }
    });
  }


  return <>
    <div className="max-w-7xl mx-auto">

      <div className="bg-blue-500 text-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Screen Recordings</h1>
            <p className="text-indigo-100 mt-2">Manage and view your screen recordings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div onClick={() => navigate('/')} className="flex cursor-pointer items-center bg-white/20 backdrop-blur-sm rounded-full py-2 px-4">
              <span className="material-symbols-outlined text-white mr-2">home</span>
              <span className="text-white font-medium">Home</span>
            </div>

          </div>
        </div>
      </div>

      {videoUrl ? <>
        <div className="mb-4">
          <RecordingDetail loaderData={{
            url: videoUrl,
            createdAt: new Date().toISOString(),
            file: 'screen-recording.webm'
          }}
            share={() =>user?shareLink():null}
          />
        </div>

      </> : <></>}


      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Recent Recordings</h2>
        <button onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-2 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"} text-white py-3 px-5 rounded-lg shadow-md transition duration-300`}>
          <span className="material-symbols-outlined">add_circle</span>Create Recording
        </button>
      </div>



      {listLoading ? <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="shine h-[260px] rounded-xl shadow-md"></div>
          <div className="shine h-[260px] rounded-xl shadow-md"></div>
          <div className="shine h-[260px] rounded-xl shadow-md"></div>
          <div className="shine h-[260px] rounded-xl shadow-md"></div>
          <div className="shine h-[260px] rounded-xl shadow-md"></div>
          <div className="shine h-[260px] rounded-xl shadow-md"></div>
        </div>
      </> : <>
        {data.length ? <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((recording: any) => {
              return <div key={recording.id} className="bg-white rounded-xl shadow-md overflow-hidden recording-card">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                    <video src={recording.url} className="w-full h-48 cursor-pointer rounded-md bg-gray-200" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-4xl">play_circle</span>
                      </div>
                    </div>
                    <div
                      onClick={() => navigate(`/screen-recording/${recording.file}`)}
                      className="play-overlay cursor-pointer absolute inset-0 bg-opacity-40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded">
                      04:32
                    </div>
                  </div>
                  <div className="p-5">
                    <h3
                      onClick={() => navigate(`/screen-recording/${recording.file}`)}
                      className="font-semibold text-lg mb-2 truncate cursor-pointer">{recording.name || recording.file}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <span className="material-symbols-outlined text-sm mr-1">event</span>
                      <span>{datepipeModel.datetime(recording.createdAt)}</span>
                    </div>
                    {/* <div className="flex items-center text-gray-500 text-sm mt-1">
                            <span className="material-icons text-sm mr-1">storage</span>
                            <span>42.5 MB</span>
                        </div> */}
                  </div>
                </div>
                <div className="px-5 py-4 bg-gray-50 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyItem(recording)}
                      className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition">
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                    <button onClick={()=>deleteItem(recording)} className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            })}

          </div>
        </> : <>
          {videoUrl ? <>
            <div className="bg-white rounded-xl shadow-md p-12 text-center mt-8">
              <div className="mx-auto w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <span className="material-icons text-indigo-500 text-4xl">videocam</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No recordings yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">Get started by creating your first screen recording. Capture your screen, webcam, or both with just a few clicks.</p>
              <button onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"} text-white py-3 px-5 rounded-lg shadow-md transition duration-300`}>

                <span className="material-symbols-outlined">add_circle</span>Create Your First Recording
              </button>
            </div>
          </> : <></>}
        </>}
      </>}



    </div>
  </>;
}
