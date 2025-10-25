// app/api/hello/route.ts
import envirnment from "@/envirnment";
import { getFire, updateFire } from "@/utils/firebase.utils";
import { sendMail, verificationHtml } from "@/utils/mailer.shared";
import { APP_NAME, generateSixDigitCode } from "@/utils/shared";
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

    const verificationCode = generateSixDigitCode()

    if(!res.data?.length){
      return NextResponse.json({ success: false, message:'Email is not exist' });
    }
   
    const ures=await updateFire({table,payload:{
      id:res.data[0].id,
      verificationCode:verificationCode,
      updatedAt:new Date()
    }})
    if(!ures.success){
      return NextResponse.json({ success: false, message:'Verification code is not updated'});
    }

    const mailOptions:any = {
      from:envirnment.email.from,
      to,
      subject:`${APP_NAME} - Verification Email`,
      html: verificationHtml(res.data[0],verificationCode),
    };
    const info = await sendMail(mailOptions)

    return NextResponse.json({ success: true, info });
  } catch (error:any) {
    console.error("Email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
