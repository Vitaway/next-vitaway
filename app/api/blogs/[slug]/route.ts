import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get a single blog by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const blog = await prisma.blog.findUnique({ where: { slug: params.slug } });
  if (!blog)
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  return NextResponse.json(blog);
}

// Update a blog
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { title, content, image, author } = await req.json();

    const updatedBlog = await prisma.blog.update({
      where: { slug: params.slug },
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

// Delete a blog
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.blog.delete({ where: { slug: params.slug } });
    return NextResponse.json({ message: "Blog deleted" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
