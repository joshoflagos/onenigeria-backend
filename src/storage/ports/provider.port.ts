export interface UploadResult {
  success: boolean;
  fileId: string;
  url: string;
}

export interface GetResult {
  success: boolean;
  fileData: Buffer | null;
  url?: string;
}

export interface DeleteResult {
  success: boolean;
  message: string;
}

export abstract class StorageProvider {
  abstract upload(fileName: string, fileData: Buffer): Promise<{ url: string }>;
  abstract delete(fileId: string): Promise<{ success: boolean }>;
}
