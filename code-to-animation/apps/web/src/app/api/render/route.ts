import { NextRequest, NextResponse } from "next/server";
import type { ProjectConfig } from "@code-to-animation/animation-core";
import { startRender } from "@/lib/render/render-job-manager";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const config = (await request.json()) as ProjectConfig;
    const result = await startRender(config);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ jobId: result.jobId });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
