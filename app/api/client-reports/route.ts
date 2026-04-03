import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
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

    const user = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const reports = await prisma.clientReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error: any) {
    console.error("CLIENT REPORTS GET ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const { title, period, metric, result, status } = body;

    if (!title || !period || !metric || !result || !status) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const report = await prisma.clientReport.create({
      data: {
        title,
        period,
        metric,
        result,
        status,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report added successfully.",
      report,
    });
  } catch (error: any) {
    console.error("CLIENT REPORTS POST ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Server error." },
      { status: 500 }
    );
  }
}