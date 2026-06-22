export interface AudioSnapshot {
  timestampLabel: string;
  signalLabel: string;
  description: string;
}

export interface ClaudeAnalysisResult {
  mediaType: string;
  imageType: string;
  overallForgeryScore: number;
  verdict: string;
  authenticityScore?: number;      
  fakeProbabilityScore?: number;
  analysisSummary: string;
  detailedBreakdown: CategoryBreakdown[];
  strongestEvidenceSnapshots: EvidenceSnapshot[];
  audioSnapshots?: AudioSnapshot[];
  riskLevel: "High" | "Medium" | "Low";
  recommendation: string;
}

export interface CategoryBreakdown {
  category: string;
  score: number;
  explanation: string;
}

export interface EvidenceSnapshot {
  label: string;
  description: string;
}

export interface DeepfakeReportDto {
  originalFilename: string;
  fileType: string;
  fileSize: string;
  scanTimestamp: string;
  verdict: string;
  confidenceScore: number;
  signals: DetectionSignal[];
  detectionMethod: string;
  modelVersion: string;
  analysis?: ClaudeAnalysisResult;  // ← new
}

export interface DetectionSignal {
  name: string;
  score: number;
  confidence: number;
}