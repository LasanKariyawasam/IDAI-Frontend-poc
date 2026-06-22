import { DeepfakeReportDto } from "../types/deepFakeReport";

const API_BASE = "http://localhost:5256/api/deepfake";

export async function detectDeepfake(file: File): Promise<DeepfakeReportDto> {
  const formData = new FormData();
  formData.append("file", file); 

  const response = await fetch(`${API_BASE}/detect/upload`, {
    method: "POST",
    body: formData,

  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).error || `Server error: ${response.status}`);
  }

  return response.json();
}