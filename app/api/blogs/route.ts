import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, image, author } = await req.json();
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const newBlog = await prisma.blog.create({
      data: { title, slug, content, image, author },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
