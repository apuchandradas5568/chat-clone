import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma.db";
import { pusherServer } from "@/app/libs/pusher";

interface Iparams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Iparams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // check if conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // delete conversation
    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    conversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:remove", conversation);
      }
    });

    return NextResponse.json(deleteConversation);
  } catch (error: any) {
    return new NextResponse("Failed to delete conversation", { status: 500 });
  }
}
