import { db } from "@/lib/db";
import { currentProfile } from "@/utils/currentProfile";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string }}
) {
    try {
        
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        // update the invitecode
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            }
        });


        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID_API]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}