
import { encrypt } from "@/utils/crypto.server";
import { addFire, getFire } from "@/utils/firebase.utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import envirnment from "@/envirnment";
import { sendVerificationEmail } from "@/utils/mailer.shared";

export async function GET() {
    return NextResponse.json({ message: "Hello from API!" });
}

const table = "users";
export async function POST(req: Request) {

    const payload = await req.json();
    const headers = Object.fromEntries(req.headers.entries())

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    if (!payload.email || !payload.password || !payload.name) {
        return NextResponse.json({ success: true, status: 200, message: 'Please enter required fields' }, { status: 400 });
    }


    try {
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
                status: 'active',
                isVerified: false,
                createdAt: new Date(),
                platform: headers[`sec-ch-ua-platform`],
                origin: headers[`referer`],
                userAgent: headers['sec-ch-ua'] || headers[`user-agent`],
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
                payload: { ...data, accessToken },
            });

            const vres = await sendVerificationEmail({ data: { ...res.data } })
            if (!vres.success) {
                return NextResponse.json(vres, { status: 400 });
            }
        }
        return NextResponse.json({ ...response, headers }, { status: response?.status });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }

}