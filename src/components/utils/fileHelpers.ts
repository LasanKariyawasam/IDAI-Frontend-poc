import { FILE_LIMITS, FileCategory, ACCEPTED_FORMATS, FileLimitEntry } from "../constants/fileConfig";

export function getFileCategory(filename: string): FileCategory | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  for (const [cat, info] of Object.entries(FILE_LIMITS) as [FileCategory, FileLimitEntry][]) {
    if (info.exts.includes(ext)) return cat;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function validateFile(file: File): string | null {
  const cat = getFileCategory(file.name);
  if (!cat) return `Unsupported file type. Accepted: ${ACCEPTED_FORMATS.join(", ")}`;
  if (file.size > FILE_LIMITS[cat].bytes)
    return `File too large. ${FILE_LIMITS[cat].label} limit is ${FILE_LIMITS[cat].limit}.`;
  return null;
}