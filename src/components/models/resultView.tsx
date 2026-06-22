import { useState } from "react";
import { DeepfakeReportDto } from "../types/deepFakeReport";
import { generatePdfReport } from "./generateReport";

// Circular gauge SVG 
function CircularGauge({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
      <circle
        cx={70} cy={70} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)" }}
      />
      <text x={70} y={66} textAnchor="middle" fill={color}
        fontSize={28} fontWeight={800} fontFamily="'Inter',sans-serif">{score}%</text>
      <text x={70} y={84} textAnchor="middle" fill="rgba(255,255,255,0.4)"
        fontSize={10} fontFamily="'DM Mono',monospace">AI probability</text>
    </svg>
  );
}

// Probability gradient bar
function ProbabilityBar({ score }: { score: number }) {
  return (
    <div style={{ width: "100%", padding: "0 0 4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#22c55e", fontFamily: "'DM Mono',monospace" }}>
          Likely Real (0–39%)
        </span>
        <span style={{ fontSize: 11, color: "#f59e0b", fontFamily: "'DM Mono',monospace" }}>
          Uncertain (40–69%)
        </span>
        <span style={{ fontSize: 11, color: "#ef4444", fontFamily: "'DM Mono',monospace" }}>
          AI-generated (70–100%)
        </span>
      </div>
      <div style={{
        width: "100%", height: 8, borderRadius: 999, overflow: "hidden",
        background: "rgba(255,255,255,0.07)",
        position: "relative",
      }}>
        {/* Filled portion, clipped to actual score */}
        <div style={{
          width: `${score}%`, height: "100%", borderRadius: 999,
          background: "linear-gradient(90deg, #22c55e 0%, #22c55e 39%, #f59e0b 40%, #f59e0b 69%, #ef4444 70%, #ef4444 100%)",
          backgroundSize: `${10000 / Math.max(score, 1)}% 100%`,
          transition: "width 0.7s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono',monospace" }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

//Verdict badge
function VerdictBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 999, padding: "6px 14px",
      fontSize: 14, fontWeight: 700, color,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

// Main ResultView
export function ResultView({ result, file, onReset }: {
  result: DeepfakeReportDto;
  file: File;
  onReset: () => void;
}) {
  const [dlHovered, setDlHovered] = useState(false);
  const [scanHovered, setScanHovered] = useState(false);

  const analysis = result.analysis;
  const isAudio = result.fileType?.startsWith("audio/");

  const isFake =
    result.verdict.toLowerCase().includes("fake") ||
    result.verdict.toLowerCase().includes("manipulated") ||
    result.verdict.toLowerCase().includes("generated") ||
    result.verdict.toLowerCase().includes("voice");

  // Score to display
  const aiScore = isAudio
    ? (result.confidenceScore)
    : (analysis?.overallForgeryScore ?? result.confidenceScore);

  // Gauge color
  const gaugeColor =
    aiScore < 40 ? "#22c55e" :
      aiScore < 70 ? "#f59e0b" : "#ef4444";

  // Verdict label
  const verdictLabel =
    aiScore < 40 ? "Likely Real" :
      aiScore < 70 ? "Uncertain" : "AI-generated";

  // Media type label
  const mediaLabel = isAudio ? "AUDIO" : file.type.startsWith("video/") ? "VIDEO" : "IMAGE";

  function getScoreColor(score: number) {
    if (score < 20) return "#22c55e";
    if (score < 50) return "#f59e0b";
    return "#ef4444";
  }

  function AudioSnapshotCard({ timestampLabel, signalLabel, description }: {
  timestampLabel: string; signalLabel: string; description: string;
}) {
  const isSynthetic = signalLabel.toLowerCase().includes("synthetic");
  const accentColor = isSynthetic ? "#ef4444" : "#22c55e";

  return (
    <div style={{
      background: "#0a0a0a", borderRadius: 10, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* Waveform visual */}
      <div style={{
        background: "#000", height: 110,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", padding: "0 16px",
      }}>
        <div style={{ display: "flex", gap: 3, alignItems: "center", width: "100%" }}>
          {Array.from({ length: 28 }).map((_, j) => {
            const height = 12 + Math.abs(Math.sin(j * 0.9 + j * 0.3) * 35) + (j % 3 === 0 ? 10 : 0);
            return (
              <div key={j} style={{
                flex: 1, borderRadius: 999,
                height: `${height}px`,
                background: isSynthetic
                  ? `rgba(239,68,68,${0.3 + (j % 4) * 0.15})`
                  : `rgba(34,197,94,${0.3 + (j % 4) * 0.15})`,
              }} />
            );
          })}
        </div>
        <span style={{
          position: "absolute", bottom: 8, right: 10,
          fontSize: 11, color: "rgba(255,255,255,0.4)",
          fontFamily: "'DM Mono',monospace",
        }}>
          {timestampLabel}
        </span>
      </div>

      {/* Label + description */}
      <div style={{ padding: "10px 14px" }}>
        <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: accentColor }}>
          {signalLabel}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

  const forgeryScore = analysis?.overallForgeryScore ?? result.confidenceScore;
  const scoreColor = getScoreColor(forgeryScore);
  const scoreLabel =
    forgeryScore < 20 ? "Likely Authentic" :
    forgeryScore < 50 ? "Suspicious" : "Likely Fake";

  function CategoryCard({ category, score, explanation }: {
    category: string; score: number; explanation: string;
  }) {
    const color = getScoreColor(score);
    return (
      <div style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10, padding: "14px 18px",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
            {category}
          </span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 700, color }}>
            {score}%
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 999, background: `${color}18`, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${score}%`, borderRadius: 999,
            background: color, transition: "width 0.7s cubic-bezier(.16,1,.3,1)",
          }} />
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
          {explanation}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: "#0f172a",
      }}
    >


      {/* EXISTING CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "28px 28px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/*TOP ROW: gauge + verdict info */}
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", marginBottom: 24 }}>

          {/* Gauge */}
          <div style={{ flexShrink: 0 }}>
            <CircularGauge score={aiScore} color={gaugeColor} />
          </div>

          {/*Verdict block */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
            <p style={{
              margin: 0, fontSize: 10, letterSpacing: 1.5,
              color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono',monospace",
              textTransform: "uppercase",
            }}>
              Detection Report · {mediaLabel}
            </p>

            <VerdictBadge label={verdictLabel} color={gaugeColor} />

            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
              {aiScore}% probability this media is AI-generated
            </p>

            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono',monospace" }}>
              {new Date(result.scanTimestamp).toLocaleString("en-US", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/*PROBABILITY BAR*/}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 0",
          marginBottom: 20,
        }}>
          <ProbabilityBar score={aiScore} />
        </div>

        {/* ANALYSIS TEXT*/}
        {analysis?.analysisSummary && (
          <div style={{ marginBottom: 20 }}>
            <p style={{
              margin: "0 0 8px", fontSize: 10, letterSpacing: 1.5,
              color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono',monospace",
              textTransform: "uppercase",
            }}>Analysis</p>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              {analysis.analysisSummary}
            </p>
          </div>
        )}

        {/* Fallback if no analysis */}
        {!analysis?.analysisSummary && (
          <div style={{ marginBottom: 20 }}>
            <p style={{
              margin: "0 0 8px", fontSize: 10, letterSpacing: 1.5,
              color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono',monospace",
              textTransform: "uppercase",
            }}>Analysis</p>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontStyle: "italic" }}>
              {aiScore < 40
                ? "No significant AI-generation indicators detected. This media appears to be authentic."
                : aiScore < 70
                  ? "Some anomalies detected that may indicate manipulation. Manual review is recommended."
                  : "Strong indicators of AI generation or manipulation detected in this media."}
            </p>
          </div>
        )}


               {/*AUDIO SNAPSHOTS*/}
       {(analysis?.audioSnapshots ?? []).length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700,
            color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono',monospace",
            letterSpacing: 1.2, textTransform: "uppercase" }}>
            Strongest Evidence Snapshots
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {analysis?.audioSnapshots?.map((snap, i) => (
              <AudioSnapshotCard
                key={i}
                timestampLabel={snap.timestampLabel}
                signalLabel={snap.signalLabel}
                description={snap.description}
              />
            ))}
          </div>
        </div>
      )}

       {/*AUDIO CATEGORY BREAKDOWN */}
       {result.fileType?.startsWith("audio/") && analysis?.detailedBreakdown && (
        <div style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: "16px 18px", marginBottom: 16,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
        }}>
          {/* Left: authenticity bars */}
          <div>
            <p style={{ margin: "0 0 12px", fontSize: 10, color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: 1 }}>
              Authenticity Breakdown
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 90 }}>
                  Authenticity
                </span>
                <div style={{ flex: 1, height: 10, borderRadius: 999,
                  background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%",
                    width: `${analysis.authenticityScore ?? (100 - forgeryScore)}%`,
                    background: "#22c55e", borderRadius: 999 }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", width: 90 }}>
                  Fake Prob.
                </span>
                <div style={{ flex: 1, height: 10, borderRadius: 999,
                  background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ height: "100%",
                    width: `${analysis.fakeProbabilityScore ?? forgeryScore}%`,
                    background: "#ef4444", borderRadius: 999 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* DETAILED BREAKDOWN*/}
        {(analysis?.detailedBreakdown ?? []).length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono',monospace", letterSpacing: 1.2, textTransform: "uppercase" }}>
              Detailed Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {analysis?.detailedBreakdown?.map((cat, i) => (
                <CategoryCard key={i} category={cat.category} score={cat.score} explanation={cat.explanation} />
              ))}
            </div>
          </div>
        )}

        {/* BUTTONS*/}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onReset}
            onMouseEnter={() => setScanHovered(true)}
            onMouseLeave={() => setScanHovered(false)}
            style={{
              flex: 1,
              background: scanHovered
                ? "linear-gradient(135deg,#a855f7,#7c3aed)"
                : "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#fff", borderRadius: 10, padding: "11px 0",
              fontSize: 13, fontWeight: 600, fontFamily: "'Inter',sans-serif",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 7,
              transition: "all 0.2s",
              boxShadow: scanHovered ? "0 4px 16px rgba(168,85,247,0.35)" : "none",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            </svg>
            Scan another file
          </button>

          <button
            onClick={() => generatePdfReport(result)}
            onMouseEnter={() => setDlHovered(true)}
            onMouseLeave={() => setDlHovered(false)}
            style={{
              flex: 1,
              background: dlHovered ? "rgba(255,255,255,0.1)" : "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.65)", borderRadius: 10, padding: "11px 0",
              fontSize: 13, fontWeight: 500, fontFamily: "'Inter',sans-serif",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 7,
              transition: "all 0.2s",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v13M7 11l5 5 5-5" /><path d="M4 20h16" />
            </svg>
            Generate Report
          </button>
        </div>

        {/* Disclaimer */}
        <p style={{
          fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic",
          textAlign: "center", margin: "16px 0 0", lineHeight: 1.6,
        }}>
          This report is generated by automated AI analysis. Results should be independently verified by qualified professionals.
        </p>
      </div>
    </div>
  );
}