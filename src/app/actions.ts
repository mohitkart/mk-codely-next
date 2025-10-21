// app/actions.js
"use server";

import { addMessage } from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData:any) {
  const text = formData.get("text");
  const user = formData.get("user") || "Guest";

  addMessage({ user, text });

  // trigger ISR revalidation for /chat
  revalidatePath("/chat");
}
