import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { NextResponse } from "next/server";


export async function GET() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        return NextResponse.json(user)
    }catch (error) {
        return error;
    }
}