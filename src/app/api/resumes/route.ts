import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, data } = await req.json();
    
    // For Phase 1 (MVP), we'll use a single user ID or no ID
    const resume = await prisma.resume.create({
      data: {
        title,
        data,
      },
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}
