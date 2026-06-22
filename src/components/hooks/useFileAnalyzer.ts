import { useState, useCallback } from "react";
import { validateFile } from "../utils/fileHelpers";
import { detectDeepfake } from "../services/deepFakeApi";
import { DeepfakeReportDto } from "../types/deepFakeReport"; 

export function useFileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DeepfakeReportDto | null>(null); 
  const handleFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      setResult(null);
      return;
    }
    setError("");
    setFile(f);
    setResult(null);
  }, []);

  // Analyze file using the API and handle results
  const analyzeFile = useCallback(async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    setError("");

    try {
      const report = await detectDeepfake(file);
      console.log("Received report:", report);
      setResult(report);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError("");
    setAnalyzing(false);
  }, []);

  return { file, error, analyzing, result, handleFile, analyzeFile, reset };
}