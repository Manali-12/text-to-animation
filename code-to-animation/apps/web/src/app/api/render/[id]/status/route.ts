import { NextRequest, NextResponse } from "next/server";
import { getJobStatus } from "@/lib/render/render-job-manager";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const status = getJobStatus(params.id);

  if (!status) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(status);
}
