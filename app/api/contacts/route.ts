import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fullname, email, message } = await req.json();

  if (!fullname || !email || !message) {
    return NextResponse.json({ message: "All fields are required" });
  }

  try {
    await prisma.contact.create({
      data: { name: fullname, email, message },
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
