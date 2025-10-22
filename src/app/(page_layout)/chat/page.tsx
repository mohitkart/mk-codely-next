"use client";
import envirnment from "@/envirnment";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket:any;

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Connect to socket server
    socket = io(envirnment.api, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket?.id);
    });

    socket.on("chat-message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("chat-message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">💬 Live Chat</h1>

      <div className="w-full h-64 border rounded p-2 overflow-y-auto mb-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="p-1 border-b text-sm">
            {msg}
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
  );
}
