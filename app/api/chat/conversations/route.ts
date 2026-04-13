import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function normalizePair(a: number, b: number) {
  return a < b ? { userAId: a, userBId: b } : { userAId: b, userBId: a };
}

export async function GET() {
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

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
      include: {
        userA: {
          select: { id: true, name: true, email: true, role: true },
        },
        userB: {
          select: { id: true, name: true, email: true, role: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const result = conversations.map((conversation) => {
      const otherUser =
        conversation.userAId === currentUser.id
          ? conversation.userB
          : conversation.userA;

      return {
        id: conversation.id,
        otherUser,
        lastMessage: conversation.messages[0] || null,
        updatedAt: conversation.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      conversations: result,
    });
  } catch (error) {
    console.error("CHAT CONVERSATIONS GET ERROR:", error);
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
    const targetUserId = Number(body.targetUserId);

    if (!targetUserId || targetUserId === currentUser.id) {
      return NextResponse.json(
        { success: false, message: "Invalid target user." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Target user not found." },
        { status: 404 }
      );
    }

    const pair = normalizePair(currentUser.id, targetUserId);

    const conversation = await prisma.conversation.upsert({
      where: {
        userAId_userBId: {
          userAId: pair.userAId,
          userBId: pair.userBId,
        },
      },
      update: {},
      create: {
        userAId: pair.userAId,
        userBId: pair.userBId,
      },
      include: {
        userA: {
          select: { id: true, name: true, email: true, role: true },
        },
        userB: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("CHAT CONVERSATIONS POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}