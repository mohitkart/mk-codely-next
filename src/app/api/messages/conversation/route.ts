// app/api/messages/route.js
import { NextResponse } from "next/server";
import { getConversation, addConversation } from "@/utils/db";
import { revalidatePath } from "next/cache";

// GET → fetch all messages
export async function GET() {
  const data = getConversation();
  return NextResponse.json(data);
}

// POST → add new message
export async function POST(req:Request) {
  const body = await req.json();
  const newMsg = addConversation(body);

  // trigger ISR rebuild of /chat
  revalidatePath("/chat");
  return NextResponse.json(newMsg);
}
