export interface UploadedImage {
  base64: string;
  mimeType: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface HistoryEntry {
  id: string;
  generatedImage: string;
  originalImage: UploadedImage;
  prompt: string;
  aspectRatio: string;
  timestamp: number;
}