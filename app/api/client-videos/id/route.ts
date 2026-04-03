import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;
    const authRole = cookieStore.get("auth_role")?.value;

    if (!authUser || authRole !== "client") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const videoId = Number(id);

    if (Number.isNaN(videoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid video id." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { action } = body;

    let nextStatus = "";

    if (action === "approve") nextStatus = "Approved";
    else if (action === "revision") nextStatus = "Revision Needed";
    else if (action === "reject") nextStatus = "Rejected";
    else {
      return NextResponse.json(
        { success: false, message: "Invalid action." },
        { status: 400 }
      );
    }

    const existingVideo = await prisma.clientVideo.findFirst({
      where: {
        id: videoId,
        userId: user.id,
      },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { success: false, message: "Video not found." },
        { status: 404 }
      );
    }

    const updatedVideo = await prisma.clientVideo.update({
      where: { id: videoId },
      data: {
        status: nextStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video status updated successfully.",
      video: updatedVideo,
    });
  } catch (error: any) {
    console.error("CLIENT VIDEO PATCH ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Server error." },
      { status: 500 }
    );
  }
}