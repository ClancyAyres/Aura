import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/repos/ClancyAyres/Aura", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) return NextResponse.json({ stars: null }, { status: 200 });

    const json = await res.json();
    const stars =
      typeof json?.stargazers_count === "number" ? json.stargazers_count : null;
    return NextResponse.json({ stars }, { status: 200 });
  } catch {
    return NextResponse.json({ stars: null }, { status: 200 });
  }
}

