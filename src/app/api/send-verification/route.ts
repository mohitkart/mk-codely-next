// app/api/hello/route.ts
import { getFire } from "@/utils/firebase.utils";
import { sendVerificationEmail } from "@/utils/mailer.shared";
import { NextResponse } from "next/server";

const table='users'

export async function GET() {
  return NextResponse.json({ message: "Hello from API!" });
}

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    const res=await getFire({table:table,conditions:[{
      field:'email',
      operator:'==',
      value:to
    }]})


    if(!res.data?.length){
      return NextResponse.json({ success: false, message:'Email is not exist' });
    }
   
    const vres = await sendVerificationEmail({ data: res.data[0] })
    return NextResponse.json(vres,{status:vres.success?200:400});
  } catch (error:any) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
