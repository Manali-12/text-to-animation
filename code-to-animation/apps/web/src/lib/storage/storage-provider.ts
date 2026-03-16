export interface StorageProvider {
  save(jobId: string, filePath: string): Promise<string>;
  getFilePath(jobId: string): Promise<string | null>;
  getDownloadUrl(jobId: string): string;
  delete(jobId: string): Promise<void>;
  exists(jobId: string): Promise<boolean>;
}
