

import { encrypt } from "@/utils/crypto.server";
import { getFire, getIdFire, updateFire } from "@/utils/firebase.utils";
import { sendVerificationEmail } from "@/utils/mailer.shared";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Hello from API!" });
}

const table = "users";
export async function POST(req: Request) {
    const payload = await req.json();
    // 🔍 Check user credentials
    const res = await getFire({
        table,
        conditions: [
            { field: "email", operator: "==", value: payload.email.toLowerCase().trim() },
        ],
    });

    const fres = res.data;
    let response: any = { success: false, message: "" };

    if (!fres || fres.length === 0) {
        response = { success: false, message: "Credentials are not matched" };
    } else {
        let data: any = {
            ...fres[0],
            lastLogin: new Date().toISOString(),
        };

        const isMatch = await bcrypt.compare(payload.password, data.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "You entered the wrong password." }, { status: 400 });
        }

        if (!data?.isVerified) {
            const res=await sendVerificationEmail({data:data})
            if(!res.success){
                return NextResponse.json(res, { status: 400 });
            }
            return NextResponse.json({ success: false, message: "Verification link sent! Check your email to continue." }, { status: 400 });
        }

        // 🔑 Generate new token
        const accessToken = encrypt(
            JSON.stringify({
                email: data.email,
                id: data.id,
                role: data.role,
                lastLogin: data.lastLogin,
            })
        );

        await updateFire({
            table,
            payload: { id: data.id, accessToken, lastLogin: data.lastLogin },
        });

        data = { ...data, accessToken };
        delete data.password;
        delete data.verificationCode;

        // 🔍 Fetch role details
        const roleres = await getIdFire({ table: "roles", id: data.role });
        data.roleDetail = roleres.data;

        response = { success: true, data };
    }
    return NextResponse.json({ ...response }, { status: response.success ? 200 : 400 });
}