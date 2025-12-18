// app/api/hello/route.ts
import { decrypt } from "@/utils/crypto.server";
import { getFire, getIdFire, updateFire } from "@/utils/firebase.utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const table = 'users'

export async function GET() {
  return NextResponse.json({ message: "Hello from API!" });
}

export async function PUT(req: Request) {
  try {
    const { password, q } = await req.json();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const value = decrypt(q)
    const email = value.split('#')[0]
    const code = value.split('#')[1]

    const res = await getFire({
      table: table, conditions: [
        {
          field: 'email',
          operator: '==',
          value: email
        },
        {
          field: 'verificationCode',
          operator: '==',
          value: Number(code)
        }
      ]
    })

    if (!res.data?.length) {
      return NextResponse.json({ success: false, message: 'Password reset link is expired' }, { status: 400 });
    }

    const data: any = res.data[0]
    delete data.password
    delete data.verificationCode

    const payload = {
      id: data.id,
      verificationCode: '',
      password: hashedPassword
    }
    const ures = await updateFire({
      table, payload: {
        ...payload
      }
    })

    const roleres = await getIdFire({ table: "roles", id: data.role });
    data.roleDetail = roleres.data;
    if (!ures.success) {
      return NextResponse.json({ success: false, message: 'Password is not updated' }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: data });
  } catch (error: any) {
    console.error("Reset error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
