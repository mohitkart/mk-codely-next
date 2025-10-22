"use client";
import envirnment from "@/envirnment";
import { indexedDBStorage } from "@/utils/indexedDBStorage";
import { getRandomCode } from "@/utils/shared";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;
export default function Content() {
    const [userId, setUserId] = useState({
        name: '',
        id: ''
    });
     const [selectedUser, setSelectedUser] = useState({
        name: '',
        id: ''
    });
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<{ message: string }[]>([]);

    useEffect(() => {
        socket = io(envirnment.chat_api, {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
            console.log("✅ Connected:", socket?.id);
        });
        socket.on("registered", (userId: any) => {
            setUsers((users: any[]) => {
                users.push(userId)
                const uniqueMessages =
                    Array.from(
                        new Set(
                            users.map(message => message.userId.id))).map(id => {
                                return users.find(message => message.userId.id === id);
                            });
                return uniqueMessages
            })
        });
        socket.on("chat-message", (msg: any) => {
            setMessages((prev) => [...prev, {...msg.message,from:msg.from}]);
        });
        const fetchData = async () => {
            const userdata = await indexedDBStorage.getItem('userId')
            setUserId(userdata||userId)
        }
        fetchData()

        return () => {
            socket?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (userId.id) {
            socket.emit("register", userId);
        }
    }, [userId.id])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && socket) {
            const receiverid = selectedUser.id
            const mes={
                message:message,
                createdAt:new Date().toISOString(),
                id:getRandomCode(15)
            }
            messages.push(mes)
            socket.emit("chat-message", receiverid, mes);
            setMessage("");
        }
    };

    const nameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = userId.name
        const id = `${name} ${getRandomCode(6)}`.replaceAll(' ', '_')
        if (name.trim() && socket) {
            await indexedDBStorage.setItem('userId', { name, id })
            setUserId(prev => ({ ...prev, id: id }))
        }
    };

    return (<>
        {userId?.id ? <>
        <div className="flex gap-3 max-w-[1200px] mx-auto">
             <div className="min-w-[200px]">
            {users.map(item=>{
                return <div key={item.socketId} 
                onClick={e=>{
                    setSelectedUser(item.userId)
                }}
                className={`p-3 border-b ${selectedUser.id==item.userId?.id?'text-blue-500':''}`}>{item.userId?.name}</div>
            })}
        </div>
            <div className="flex flex-col items-center w-full">
                <h1 className="text-2xl font-bold mb-4">💬 Live Chat</h1>
                <div className="w-full h-64 border rounded p-2 overflow-y-auto mb-3 bg-gray-50">
                    {messages.map((msg, i) => (
                        <div key={i} className="p-1 border-b text-sm">
                            {msg.message}
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="flex w-full gap-2">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border p-2 flex-1 rounded"
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 rounded">
                        Send
                    </button>
                </form>
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