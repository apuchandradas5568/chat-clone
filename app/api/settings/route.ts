import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prisma.db";
import { NextResponse } from "next/server";

export async function PATCH (request: Request){

try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const {name,image} = body

    if(!currentUser){
        return new NextResponse('Unauthorized', {status: 401})
    }

    const updatedUser = await prisma?.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            name,
            image
        }
    })

    return NextResponse.json(updatedUser)

} catch (error:any) {
    return new NextResponse('Failed to update user', {status: 500})
}

}


// done till 6:54