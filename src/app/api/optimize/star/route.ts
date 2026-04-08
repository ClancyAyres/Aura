import { optimizeExperience } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { company, title, description_raw, tech } = await req.json();
    
    if (!company || !title || !description_raw || !tech) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const optimized = await optimizeExperience(company, title, description_raw, tech);

    return NextResponse.json({ optimized });
  } catch (error) {
    console.error("Error optimizing experience:", error);
    return NextResponse.json({ error: "Failed to optimize experience" }, { status: 500 });
  }
}
