import { decrypt } from "@/utils/crypto.server";
import { getFire, getIdFire, updateFire } from "@/utils/firebase.utils";
import { NextResponse } from "next/server";

const table = 'users'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")||'';
  const value = decrypt(q)
  const email = value.split('#')[0]
  const code = value.split('#')[1]

  let response: { success: boolean, message: string, data?: any } = { success: false, message: '', data: null };
  try {
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
      response = { success: false, message: 'Verification code is not exist' }
    } else {
      const payload = {
        id: res.data[0].id,
        verificationCode: '',
        isVerified: true,
      }
      const ures = await updateFire({
        table, payload: {
          ...payload
        }
      })
      response = {
        success: true, message: 'Verification successfully updated',
        data: {
          ...res.data[0],
          ...payload,
        }
      }
      delete response.data?.verificationCode
      delete response.data?.password
      
      // 🔍 Fetch role details
      const roleres = await getIdFire({ table: "roles", id: response.data.role });
      response.data.roleDetail = roleres.data;
      
      if (!ures.success) {
        response = { success: false, message: 'Verification code is not updated' }
      }
    }
  } catch (err: any) {
    response = { success: false, message: String(err) }
  }

  return NextResponse.json(response);
}