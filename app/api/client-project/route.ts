import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

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

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("CLIENT PROJECTS GET ERROR:", error);

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
    const { name, service, status, deadline } = body;

    if (!name || !service || !status || !deadline) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        service,
        status,
        deadline,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("CLIENT PROJECTS POST ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}