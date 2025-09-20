'use client'
import { useRef, useState } from "react";
import datepipeModel from "@/utils/datepipemodel";

type Props = {
  loaderData: any;
  share?: () => void;
}

export default function RecordingDetail({ loaderData, share }: Props) {
  const videoRef = useRef<any>(null);
  const videoUrl = loaderData?.url
  const [dimensions, setDimensions] = useState("");

  const onLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDimensions(`${video.videoWidth}×${video.videoHeight}`);
  };
  return <>
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="video-container relative">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onLoadedMetadata={onLoadedMetadata}
          className="w-full min-h-[300px] object-contain cursor-pointer"
        />

      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{loaderData?.title || loaderData?.file}</h2>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <span className="material-symbols-outlined mr-2 text-gray-500">event</span>
            <span>Created: {datepipeModel.datetime(loaderData?.createdAt)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="material-symbols-outlined mr-2 text-gray-500">aspect_ratio</span>
            <span>Resolution: {dimensions}</span>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          {loaderData?.description}
        </p>

        <div className="flex space-x-3 justify-center">
          <a href={videoUrl} target="_new" className="flex items-center border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg">
            <span className="material-symbols-outlined mr-2">download</span>
            Download
          </a>
          {share ? <>
            <button onClick={() => share()} className="flex items-center border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg">
              <span className="material-symbols-outlined mr-2">share</span>
              Share
            </button>
          </> : <></>}
        </div>
      </div>
    </div>
  </>;
}
