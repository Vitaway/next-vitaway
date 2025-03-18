import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_EMAIL_USER,
    pass: process.env.NEXT_EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  const { fullname, email, message } = await req.json();

  if (!fullname || !email || !message) {
    return NextResponse.json({ message: "All fields are required" });
  }

  try {
    await prisma.contact.create({
      data: { name: fullname, email, message },
    });

    const mailOptions = {
      from: process.env.NEXT_EMAIL_USER,
      to: email,
      subject: "Message Received",
      html: `
        <h3>Hello ${fullname},</h3>
        <p>Thank you for reaching out! We have received your message:</p>
        <blockquote>${message}</blockquote>
        <p>We will get back to you soon.</p>
        <br>
        <p>Best regards,<br>Vitaway</p>
      `,
    };

    await transporter.sendMail(mailOptions);

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
