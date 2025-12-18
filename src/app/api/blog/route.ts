// app/api/hello/route.ts
import { blogData } from "@/data/blogs";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "blogs data",data:blogData });
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ message: `You sent: ${data.name}` });
}