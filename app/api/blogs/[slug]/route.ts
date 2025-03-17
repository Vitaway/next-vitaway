import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();

  const blog = await prisma.blog.findUnique({ where: { slug: slug } });

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(req: NextRequest) {
  try {
    const { title, content, image, author, slug } = await req.json();

    const updatedBlog = await prisma.blog.update({
      where: { slug: slug },
      data: { title, content, image, author },
    });

    return NextResponse.json(updatedBlog);
  } catch {
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { slug } = await req.json();
    await prisma.blog.delete({ where: { slug: slug } });
    return NextResponse.json({ message: "Blog deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
