// app/api/messages/route.js
import { NextResponse } from "next/server";
import { getMessages, addMessage } from "@/utils/db";
import { revalidatePath } from "next/cache";

// GET → fetch all messages
export async function GET() {
  const data = getMessages();
  return NextResponse.json(data);
}

// POST → add new message
export async function POST(req:Request) {
  const body = await req.json();
  const newMsg = addMessage(body);

  // trigger ISR rebuild of /chat
  revalidatePath("/chat");

  return NextResponse.json(newMsg);
}
