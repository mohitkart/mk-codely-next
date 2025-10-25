// app/api/hello/route.ts
import { encrypt } from "@/utils/crypto.server";
import { addFire, getFire } from "@/utils/firebase.utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import axios from "axios";
import envirnment from "@/envirnment";

export async function GET() {
    return NextResponse.json({ message: "Hello from API!" });
}

const table = "users";
export async function POST(req: Request) {

    const payload = await req.json();
    const headers = Object.fromEntries(req.headers.entries())

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    // 🔍 Check user exists
    const res = await getFire({
        table,
        conditions: [
            { field: "email", operator: "==", value: payload.email.toLowerCase().trim() },
        ],
    });

    const fres = res.data;
    let response = { success: true, status: 200, message: 'Signup successfully' };

    if (fres.length) {
        response = { success: false, status: 400, message: "User is already exist" };
    } else {
        const data: any = {
            ...payload,
            password: hashedPassword,
            role: envirnment.userRoleId,
            status:'active',
            isVerified:false,
            platform: headers[`sec-ch-ua-platform`],
            origin: headers[`referer`],
            createdAt: new Date(),
            userAgent: headers[`user-agent`],
        };

        // 🔑 Generate new token
        const accessToken = encrypt(
            JSON.stringify({
                email: data.email,
                id: data.id,
                role: data.role,
            })
        );

        const res = await addFire({
            table,
            payload: { ...data, accessToken},
        });

        try {
            const apires = await axios.post(`${envirnment.frontUrl}api/send-verification`, { to: data.email })
        } catch (err) {
            response = { success: true, status: 500, message: String(err) };
        }
    }
    return NextResponse.json({ ...response ,headers}, { status: response?.status });
}