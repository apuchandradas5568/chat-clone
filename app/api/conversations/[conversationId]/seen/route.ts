import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prisma.db'
import { pusherServer } from "@/app/libs/pusher";

interface Iparams {
    conversationId: string;
}


export async function POST (request:Request, {params} : {params: Iparams}){

    try {
        const currentUser = await getCurrentUser()
        const conversationId = params.conversationId

        if(!currentUser){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const converation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            },
        })


        if(!converation){
            return new NextResponse("Not Found", {status: 404})
        }


        // find the last message 

        const lastMessage = converation.messages[converation.messages.length - 1]

        if(!lastMessage){
            return NextResponse.json(converation)
        }

        // update seen of last message
        const updatedMessage = await prisma.message.update({
            where: {
                id: lastMessage.id
            },
            include : {
                sender: true,
                seen: true
            }, 
            data: {
                seen: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        })

        await pusherServer.trigger(currentUser.email as string, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        })

        if(lastMessage.seenIds.indexOf(currentUser.id) !== -1){
            return NextResponse.json(converation)
        }

        await pusherServer.trigger(conversationId!, 'messages:update', updatedMessage)
        

        return NextResponse.json(updatedMessage)


        
    } catch (error:any) {
        return new NextResponse("Internal Error", {status: 500})
    }
}