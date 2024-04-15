export interface UploadImageResponse {
  photos: string[];
  errors: { files: Buffer; msg: string; }[]
}