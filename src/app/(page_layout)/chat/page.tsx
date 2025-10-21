// app/chat/page.jsx
import { getMessages } from "@/utils/db";
import { sendMessage } from "@/app/actions";

export const revalidate = 10; // ⏱ revalidate every 10 seconds (ISR)

export default async function ChatPage() {
  const messages = getMessages();

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-bold mb-4">💬 Simple ISR Chat</h1>

      <div className="border p-4 rounded bg-gray-50 space-y-2 min-h-[200px]">
        {messages.map((msg:any) => (
          <div key={msg.id}>
            <b>{msg.user}:</b> {msg.text}
          </div>
        ))}
      </div>

      <form action={sendMessage} className="space-y-2">
        <input
          type="text"
          name="user"
          placeholder="Your name"
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          name="text"
          placeholder="Type a message..."
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>

      <p className="text-sm text-gray-500">
        (This page revalidates every 10s, or immediately when a message is sent)
      </p>
    </div>
  );
}
