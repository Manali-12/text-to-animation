import fs from "fs/promises";
import path from "path";
import type { StorageProvider } from "./storage-provider";

const RENDER_OUTPUT_DIR = process.env.RENDER_OUTPUT_DIR || "/tmp/renders";

export class LocalStorageProvider implements StorageProvider {
  private readonly outputDir: string;

  constructor(outputDir: string = RENDER_OUTPUT_DIR) {
    this.outputDir = outputDir;
  }

  async save(jobId: string, sourcePath: string): Promise<string> {
    await fs.mkdir(this.outputDir, { recursive: true });
    const destPath = path.join(this.outputDir, `${jobId}.mp4`);

    if (sourcePath !== destPath) {
      await fs.copyFile(sourcePath, destPath);
    }

    return destPath;
  }

  async getFilePath(jobId: string): Promise<string | null> {
    const filePath = path.join(this.outputDir, `${jobId}.mp4`);
    const fileExists = await this.exists(jobId);
    return fileExists ? filePath : null;
  }

  getDownloadUrl(jobId: string): string {
    return `/api/render/${jobId}/download`;
  }

  async delete(jobId: string): Promise<void> {
    const filePath = path.join(this.outputDir, `${jobId}.mp4`);
    try {
      await fs.unlink(filePath);
    } catch {
      // File may not exist, ignore
    }
  }

  async exists(jobId: string): Promise<boolean> {
    const filePath = path.join(this.outputDir, `${jobId}.mp4`);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getOutputDir(): string {
    return this.outputDir;
  }
}
