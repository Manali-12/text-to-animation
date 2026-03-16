import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getJob, getJobFilePath } from "@/lib/render/render-job-manager";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const job = getJob(params.id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Render not yet completed" },
      { status: 400 }
    );
  }

  const filePath = await getJobFilePath(params.id);

  if (!filePath) {
    return NextResponse.json(
      { error: "Rendered file not found" },
      { status: 404 }
    );
  }

  const fileBuffer = await fs.readFile(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="animation-${params.id}.mp4"`,
      "Content-Length": String(fileBuffer.length),
    },
  });
}
