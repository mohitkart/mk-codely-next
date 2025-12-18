// app/api/hello/route.ts
import { blogData } from "@/data/blogs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")||'';
  const ext=blogData.find(itm=>itm.id==q)
  return NextResponse.json({ message: `#${q} blog data`,data:ext });
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json({ message: `You sent: ${data.name}` });
}