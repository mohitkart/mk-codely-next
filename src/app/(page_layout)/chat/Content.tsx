"use client";
import envirnment from "@/envirnment";
import datepipeModel from "@/utils/datepipemodel";
import { indexedDBStorage } from "@/utils/indexedDBStorage";
import { getRandomCode } from "@/utils/shared";
import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

let socket: any;

type MessageType = {
    createdAt: any,
    image?: '',
    read: boolean,
    sendBy: string,
    message: string,
    sendTo: string,
    groupId: string,
    id: string
}
type UserType = {
    name: string,
    id: string
}

const postApi = async (url:string,p:any) => {
    try {
        const data = await axios.post(url, p)
        return data
    } catch (err) {
        console.log(`eee`, err,url)
        return err
    }
}

const addMessage = async (p: any) => {
   const res=await postApi(`${envirnment.frontUrl}api/messages`,p)
}
const addConversation = async (p: any) => {
    const res=await postApi(`${envirnment.frontUrl}api/messages/conversation`,p)
}

export default function Content({
    posts,
    conversations
}: { posts: any[],conversations:any[]}) {
    const [userId, setUserId] = useState<UserType>({
        name: '',
        id: ''
    });
    const [selectedUser, setSelectedUser] = useState<UserType>({
        name: '',
        id: ''
    });
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState<UserType[]>([...conversations]);
    const [messages, setMessages] = useState<any[]>([...posts]);

    
    const scrollMe = () => {
        const el = document.getElementById("scrollMe")
        if (el) {
            setTimeout(() => {
                el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
            }, 200);
        }
    }

    useEffect(() => {
        socket = io(envirnment.chat_api, {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
            console.log("✅ Connected:", socket?.id);
        });
        socket.on("registered", (msg: any) => {
            setUsers((users: any[]) => {
                users.push(msg?.userId)
                const uniqueMessages =
                    Array.from(
                        new Set(
                            users.map(message => message.id))
                    ).map(id => {
                        return users.find(message => message.id === id);
                    });
                return uniqueMessages
            })
        });
        socket.on("chat-message", (msg: any) => {
             console.log("chat-message",msg)
            setMessages((messages: MessageType[]) => {
                messages.push(msg?.message)
                const uniqueMessages =
                    Array.from(
                        new Set(
                            messages.map(message => message.id))
                    ).map(id => {
                        return messages.find(message => message.id === id);
                    });
                return uniqueMessages
            })
        });
        const fetchData = async () => {
            const userdata = await indexedDBStorage.getItem('userId')
            setUserId(userdata || userId)
        }
        fetchData()

        return () => {
            socket?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (userId.id) {
            socket.emit("register", userId);
            addConversation(userId)
        }
    }, [userId.id])

    const sendMessage = () => {
        if (!selectedUser.id) return
        if (message.trim() && socket) {
            const receiverid = selectedUser.id
            const groupId = [selectedUser.id, userId.id].sort().join('-')

            const mes: MessageType = {
                message: message,
                sendBy: userId.id,
                sendTo: selectedUser.id,
                createdAt: new Date().toISOString(),
                id: getRandomCode(15),
                read: false,
                groupId: groupId
            }
            setMessages((messages: MessageType[]) => {
                return [...messages,mes]
            })
            socket.emit("chat-message", receiverid, mes);
            addMessage(mes)
            setMessage("");
        }
    };

    const nameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = userId.name
        const id = `${name} ${getRandomCode(6)}`.replaceAll(' ', '_')
        if (name.trim() && socket) {
            const p = {
                name, id
            }
            await indexedDBStorage.setItem('userId', p)
            setUserId(prev => ({ ...prev, ...p }))
        }
    };

    const selectUser = (user: UserType) => {
        setSelectedUser({ ...user })
    }

    const chatMessages = useMemo(() => {
        const groupId = [userId.id, selectedUser.id].sort().join('-')
        return messages.filter(itm => itm.groupId == groupId || !itm.groupId).sort((a,b)=>{
            return new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime()
        })
    }, [messages,selectedUser.id,userId.id])

      useEffect(()=>{
        scrollMe()
    },[chatMessages])

    return (<>
        {userId?.id ? <>
            <div className="bg-gray-100 h-screen flex items-center justify-center">
                <div className="flex flex-col md:flex-row w-full max-w-6xl h-full md:h-5/6 bg-white rounded-lg shadow-lg overflow-hidden">

                    <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">

                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                    U
                                </div>
                                <h2 className="ml-3 font-semibold text-gray-800">Chats</h2>
                            </div>
                            <div className="flex space-x-4">
                                <button className="text-gray-500 hover:text-indigo-600">
                                    <span className="material-symbols-outlined ">group</span>
                                </button>
                                <button className="text-gray-500 hover:text-indigo-600">
                                    <span className="material-symbols-outlined ">more_vert</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                                <span className="material-symbols-outlined  absolute left-3 top-2 text-gray-400">search</span>
                                <input type="text" placeholder="Search conversations" className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-thin">

                            {users.map((item, i) => {
                                return <div key={item.id}
                                    onClick={() => selectUser(item)}
                                    className={`p-3 border-b border-gray-200 hover:bg-gray-100 ${selectedUser.id == item.id ? 'bg-indigo-50' : 'cursor-pointer'}`}>
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <div className="w-12 h-12 capitalize rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                                {item?.name?.[0]}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-semibold text-gray-800 capitalize">{item.name}{item.id==userId?.id?' (Self)':''}</h3>
                                                <span className="text-xs text-gray-500">Yesterday</span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">I sent you the files you requested</p>
                                        </div>
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>

                    {/* <!-- Chat Area --> */}
                    <div className="w-full md:w-2/3 flex flex-col">
                        {selectedUser?.id ? <>
                            {/* <!-- Chat Header --> */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 capitalize rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                        {selectedUser?.name?.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <h2 className="font-semibold text-gray-800 capitalize">{selectedUser?.name}</h2>
                                        <p className="text-xs text-green-500">Online</p>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <button className="text-gray-500 hover:text-indigo-600">
                                        <span className="material-symbols-outlined">call</span>
                                    </button>
                                    <button className="text-gray-500 hover:text-indigo-600">
                                        <span className="material-symbols-outlined">videocam</span>
                                    </button>
                                    <button className="text-gray-500 hover:text-indigo-600">
                                        <span className="material-symbols-outlined">info</span>
                                    </button>
                                </div>
                            </div>

                            {/* <!-- Messages Area --> */}
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scrollbar-thin"
                            id="scrollMe"
                            >
                                {/* <!-- Date separator --> */}
                                <div className="flex justify-center my-4">
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Today</span>
                                </div>

                                {chatMessages.map((item, i) => {
                                    return <Fragment key={i}>
                                        {item.sendBy == userId.id ? <>
                                            {/* <!-- Sent message --> */}
                                            <div className="flex mb-4 justify-end">
                                                <div className="message-bubble sent bg-indigo-500 p-3 rounded-lg rounded-tr-none shadow-sm">
                                                    <p className="text-white">{item.message}</p>
                                                    <span className="text-xs text-indigo-200 mt-1 block">{datepipeModel.datetime(item.createdAt)}</span>
                                                </div>
                                                <div className="w-8 h-8 capitalize rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ml-2">
                                                    {userId?.name?.[0]}
                                                </div>
                                            </div>

                                            {/* <!-- Sent message with attachment --> */}
                                            {/* <div className="flex mb-4 justify-end">
                                <div className="message-bubble sent bg-indigo-500 p-3 rounded-lg rounded-tr-none shadow-sm">
                                    <p className="text-white">Sure, I ll send you the files right away.</p>
                                    <div className="mt-2 bg-indigo-400 rounded p-2 flex items-center">
                                        <span className="material-symbols-outlined  text-white mr-2">insert_drive_file</span>
                                        <div>
                                            <p className="text-white text-sm">project_document.pdf</p>
                                            <p className="text-indigo-200 text-xs">2.4 MB</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-indigo-200 mt-1 block">10:25 AM</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ml-2">
                                    U
                                </div>
                            </div> */}
                                        </> : <>
                                            {/* <!-- Received message --> */}
                                            <div className="flex mb-4">
                                                <div className="w-8 h-8 rounded-full capitalize bg-green-500 flex items-center justify-center text-white font-bold text-xs mr-2">
                                                    {selectedUser?.name?.[0]}
                                                </div>
                                                <div className="message-bubble received bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
                                                    <p className="text-gray-800">{item.message}</p>
                                                    <span className="text-xs text-gray-500 mt-1 block">{datepipeModel.datetime(item.createdAt)}</span>
                                                </div>
                                            </div>
                                        </>}

                                    </Fragment>
                                })}
                            </div>

                            {/* <!-- Message Input --> */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center">
                                    <button className="text-gray-500 hover:text-indigo-600 p-2">
                                        <span className="material-symbols-outlined ">add</span>
                                    </button>
                                    <button className="text-gray-500 hover:text-indigo-600 p-2">
                                        <span className="material-symbols-outlined ">image</span>
                                    </button>
                                    <div className="flex-1 mx-2">
                                        <input type="text"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="Type a message" className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                    </div>
                                    <button className="text-gray-500 hover:text-indigo-600 p-2">
                                        <span className="material-symbols-outlined ">mic</span>
                                    </button>
                                    <button
                                        onClick={() => sendMessage()}
                                        className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 ml-2">
                                        <span className="material-symbols-outlined ">send</span>
                                    </button>
                                </div>
                            </div>
                        </> : <>
                            <div className="p-4 text-center flex justify-center flex-wrap">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Conversation Selected</h2>
                                <p className="text-gray-600 text-center max-w-md mb-8">
                                    Select a conversation from the sidebar to start chatting. You can also start a new conversation by clicking the button below.
                                </p>
                                <div className="flex space-x-4">
                                    <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg flex items-center hover:bg-indigo-600 transition-colors">
                                        <span className="material-icons mr-2">add</span>
                                        New Conversation
                                    </button>
                                    <button className="bg-white text-indigo-500 border border-indigo-500 px-6 py-3 rounded-lg flex items-center hover:bg-indigo-50 transition-colors">
                                        <span className="material-icons mr-2">group</span>
                                        Create Group
                                    </button>
                                </div>
                            </div>
                        </>}

                    </div>
                </div>
            </div>

        </> : <>
            <div className="flex flex-col items-center p-6 max-w-md mx-auto">
                <form onSubmit={nameSubmit} className="flex w-full gap-2">
                    <input
                        value={userId.name}
                        onChange={(e) => setUserId(prev => ({ ...prev, name: e.target.value }))}
                        className="border p-2 flex-1 rounded"
                        placeholder="Type you name"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 rounded">
                        Save
                    </button>
                </form>
            </div>
        </>}
    </>
    );
}