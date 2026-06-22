export type FileCategory = "image" | "video" | "audio" | "pdf";

export interface FileLimitEntry {
  exts: string[];
  label: string;
  limit: string;
  bytes: number;
}

export const ACCEPTED_FORMATS = ["JPG", "PNG", "WEBP", "MP4", "MOV", "MP3", "WAV", "M4A", "PDF"];

export const FILE_LIMITS: Record<FileCategory, FileLimitEntry> = {
  image: { exts: ["jpg", "jpeg", "png", "webp"], label: "Images", limit: "10MB", bytes: 10 * 1024 * 1024 },
  video: { exts: ["mp4", "mov"], label: "Video", limit: "100MB", bytes: 100 * 1024 * 1024 },
  audio: { exts: ["mp3", "wav", "m4a"], label: "Audio", limit: "50MB", bytes: 50 * 1024 * 1024 },
  pdf: { exts: ["pdf"], label: "PDF", limit: "20MB", bytes: 20 * 1024 * 1024 },
};