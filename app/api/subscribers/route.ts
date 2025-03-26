import transporter from "@/config/email-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const adminEmail = "vitawayeclinic@gmail.com";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ message: "Invalid email" });
  }

  try {
    await prisma.subscriber.create({
      data: { email },
    });

    await transporter.sendMail({
      from: process.env.NEXT_EMAIL_USER,
      to: adminEmail,
      subject: "New Subscriber Alert",
      text: `A new subscriber has joined: ${email}`,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Vitaway Health – Your Journey Starts Here!",
      text: `Dear [Name],\n\n
          Thank you for subscribing to Vitaway Health! We’re excited to have you on board. Stay tuned for expert nutrition tips, wellness programs, and exclusive offers. \n
          Visit our website: https://www.vitaway.org/who-we-serve \n\n
          Best regards,\n
          Vitaway Health Team
      `,
    });

    return NextResponse.json(
      { message: "Successfully subscribed" },
      { status: 200 }
    );
  } catch (error) {
    if ((error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { message: "Email already subscribed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
