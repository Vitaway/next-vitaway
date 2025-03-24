import transporter from "@/config/email-config";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fullname, email, message } = await req.json();

    if (!fullname || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await prisma.contact.create({
      data: { name: fullname, email, message },
    });

    const userMailOptions = {
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

    const adminMailOptions = {
      from: process.env.NEXT_EMAIL_USER,
      to: process.env.NEXT_EMAIL_USER,
      subject: "New Contact Message Received",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
      `,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
