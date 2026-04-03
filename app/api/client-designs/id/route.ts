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
    const designId = Number(id);

    if (Number.isNaN(designId)) {
      return NextResponse.json(
        { success: false, message: "Invalid design id." },
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

    const existingDesign = await prisma.clientDesign.findFirst({
      where: {
        id: designId,
        userId: user.id,
      },
    });

    if (!existingDesign) {
      return NextResponse.json(
        { success: false, message: "Design not found." },
        { status: 404 }
      );
    }

    const updatedDesign = await prisma.clientDesign.update({
      where: { id: designId },
      data: {
        status: nextStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Design status updated successfully.",
      design: updatedDesign,
    });
  } catch (error: any) {
    console.error("CLIENT DESIGN PATCH ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Server error." },
      { status: 500 }
    );
  }
}