import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = Number(searchParams.get("conversationId"));

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "conversationId is required." },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("CHAT MESSAGES GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const conversationId = Number(body.conversationId);
    const text = body.text?.trim() || "";
    const fileUrl = body.fileUrl?.trim() || null;
    const fileName = body.fileName?.trim() || null;
    const fileType = body.fileType?.trim() || null;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "conversationId is required." },
        { status: 400 }
      );
    }

    if (!text && !fileUrl) {
      return NextResponse.json(
        { success: false, message: "Message text or file is required." },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found." },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        text: text || null,
        fileUrl,
        fileName,
        fileType,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("CHAT MESSAGES POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}