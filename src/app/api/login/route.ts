// app/api/hello/route.ts
import { encrypt } from "@/utils/crypto.server";
import { getFire, updateFire } from "@/utils/firebase.utils";
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
            { field: "email", operator: "==", value: payload.email.toLowerCase() },
            { field: "password", operator: "==", value: payload.password },
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

        // 🔑 Generate new token
        const accessToken = encrypt(
            JSON.stringify({
                email: data.email,
                id: data.id,
                lastLogin: data.lastLogin,
            })
        );

        // Optional IP reuse logic
        // if (data?.IP === IP) {
        //   accessToken = data.accessToken;
        // }

        await updateFire({
            table,
            payload: { id: data.id, accessToken, lastLogin: data.lastLogin },
        });

        data = { ...data, accessToken };
        delete data.password;

        // 🔍 Fetch role details
        const roleres = await getFire({ table: "role", id: data.role });
        data.roleDetail = roleres.data;

        response = { success: true, data };
    }
    return NextResponse.json({ ...response },{ status: response.success?200:400 } );
}