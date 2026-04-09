import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ schools: [] });
  }

  try {
    const res = await fetch(
      `https://universities.hipolabs.com/search?name=${encodeURIComponent(q)}`
    );

    if (!res.ok) {
      return NextResponse.json({ schools: [] });
    }

    const data = await res.json();

    const schools = Array.isArray(data)
      ? Array.from(
          new Map(
            data
              .map((u: any) => ({
                name: typeof u?.name === "string" ? u.name : "",
              }))
              .filter((u: any) => u.name)
              .map((u: any) => [u.name, u])
          ).values()
        ).slice(0, 8)
      : [];

    return NextResponse.json({ schools });
  } catch {
    return NextResponse.json({ schools: [] });
  }
}

