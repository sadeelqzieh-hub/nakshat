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
      include: {
        clientProfile: true,
      },
    });

    if (!user || !user.clientProfile) {
      return NextResponse.json(
        { success: false, message: "Client profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user.clientProfile,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("CLIENT PROFILE GET ERROR:", error);

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

    const body = await request.json();

    const {
      companyName,
      businessType,
      contactPerson,
      phone,
      location,
      packageName,
      contractStart,
      contractStatus,
      website,
      socialMedia,
    } = body;

    if (
      !companyName ||
      !businessType ||
      !contactPerson ||
      !phone ||
      !location ||
      !packageName ||
      !contractStart ||
      !contractStatus ||
      !website ||
      !socialMedia
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
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

    const profile = await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {
        companyName,
        businessType,
        contactPerson,
        phone,
        location,
        packageName,
        contractStart,
        contractStatus,
        website,
        socialMedia,
      },
      create: {
        companyName,
        businessType,
        contactPerson,
        phone,
        location,
        packageName,
        contractStart,
        contractStatus,
        website,
        socialMedia,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Client information saved successfully.",
      profile,
    });
  } catch (error) {
    console.error("CLIENT PROFILE POST ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}