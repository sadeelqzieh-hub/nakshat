import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;
    const authRole = cookieStore.get("auth_role")?.value;

    if (!authUser || !authRole) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim();

    const currentUser = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const whereClause =
      query.length > 0
        ? {
            id: { not: currentUser.id },
            name: {
              contains: query,
            },
          }
        : {
            id: { not: currentUser.id },
          };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("CHAT USERS GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}