import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";

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

    const files = await prisma.clientFile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error: any) {
    console.error("CLIENT FILES GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Server error while loading files.",
      },
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

    const formData = await request.formData();

    const uploadedFile = formData.get("file");
    const type = String(formData.get("type") || "");
    const status = String(formData.get("status") || "");
    const date = String(formData.get("date") || "");

    if (!(uploadedFile instanceof File) || !type || !status || !date) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const bytes = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeOriginalName = uploadedFile.name.replace(/[^\w.\-]/g, "_");
    const uniqueFileName = `${Date.now()}-${safeOriginalName}`;
    const fullFilePath = path.join(uploadsDir, uniqueFileName);

    await fs.writeFile(fullFilePath, buffer);

    const sizeInMB = (uploadedFile.size / (1024 * 1024)).toFixed(2);

    const savedFile = await prisma.clientFile.create({
      data: {
        name: uploadedFile.name,
        type,
        size: `${sizeInMB} MB`,
        status,
        date,
        filePath: `/uploads/${uniqueFileName}`,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully.",
      file: savedFile,
    });
  } catch (error: any) {
    console.error("CLIENT FILES POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Server error while uploading file.",
      },
      { status: 500 }
    );
  }
}