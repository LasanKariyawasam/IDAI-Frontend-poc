import { CSSProperties, useState } from "react";
import { ResultView } from "../models/resultView";
import { formatBytes } from "../utils/fileHelpers";
import { HistoryView } from "./historyView";

interface FileUploadProps {
  dragging: boolean;
  file: File | null;
  analyzing: boolean;
  result: any;
  error: string;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onClick: () => void;
  onAnalyze: () => void;
  onReset: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type MediaTab = "Image" | "Video" | "Audio";
type NavView = "Detect" | "History";

const TAB_ICONS: Record<MediaTab, string> = { Image: "🖼", Video: "🎬", Audio: "🎙" };
const TAB_ACCEPTS: Record<MediaTab, string> = {
  Image: ".jpg,.jpeg,.png,.webp,.gif",
  Video: ".mp4,.mov,.webm,.mpeg",
  Audio: ".mp3,.wav,.ogg,.m4a",
};
const TAB_HINT: Record<MediaTab, string> = {
  Image: "JPG, PNG, WEBP, GIF — up to 20 MB",
  Video: "MP4, MOV, WEBM — up to 100 MB",
  Audio: "MP3, WAV, OGG — up to 50 MB",
};

export function FileUpload({
  dragging, file, analyzing, result, error,
  onDrop, onDragOver, onDragLeave, onClick, onAnalyze, onReset, inputRef, onFileChange,
}: FileUploadProps) {
  const [activeTab, setActiveTab] = useState<MediaTab>("Image");
  const [activeView, setActiveView] = useState<NavView>("Detect");

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#0f0d1a",
      overflow: "hidden",
    }}>

      {/*FIXED SIDEBAR*/}
      <div style={{
        width: 235,
        flexShrink: 0,
        background: "#130f23",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
      }}>

        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "20px 18px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg,#a855f7,#7c3aed)",
            borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px",
          }}>
            ID/AI
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>ID/AI</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>Detection Portal</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "14px 12px", flex: 1 }}>
          {(["Detect", "History"] as NavView[]).map((view) => {
            const isActive = activeView === view;
            return (
              <div
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", borderRadius: 9,
                  fontSize: 13, fontWeight: isActive ? 600 : 500,
                  cursor: "pointer", marginBottom: 3,
                  background: isActive ? "rgba(168,85,247,0.18)" : "transparent",
                  color: isActive ? "#d8b4fe" : "rgba(255,255,255,0.45)",
                  border: isActive ? "1px solid rgba(168,85,247,0.25)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {view === "Detect" ? (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                ) : (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                )}
                {view}
              </div>
            );
          })}
        </div>

        {/* Bottom: user info + sign out */}
        <div style={{
          padding: "14px 14px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>demo@idai.ai</div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer",
          }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </div>
        </div>
      </div>

      {/* MAIN CONTENT*/}
      <div style={{
        marginLeft: 210,
        flex: 1,
        padding: "28px 28px 20px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowY: "auto",
      }}>
        <style>{`
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes progressSlide { from { width: 0% } to { width: 90% } }
  @keyframes radarPulse {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }
`}</style>

        {activeView === "History" ? (
          <HistoryView />
        ) : (
          /* Detect view */
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>Deepfake Detector</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 6 }}>
                Upload a file to check if it's AI-generated or manipulated.
              </p>
            </div>

            {!result && (
              <div style={{
                display: "flex", gap: 0, marginBottom: 20,
                background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4,
              }}>
                {(["Image", "Video", "Audio"] as MediaTab[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: "10px 0", border: "none", borderRadius: 9, cursor: "pointer",
                    fontSize: 14, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    transition: "all 0.2s",
                    background: activeTab === tab ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "transparent",
                    color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.45)",
                    boxShadow: activeTab === tab ? "0 2px 12px rgba(168,85,247,0.35)" : "none",
                  }}>
                    <span>{TAB_ICONS[tab]}</span>{tab}
                  </button>
                ))}
              </div>
            )}

            <div
              style={{
                width: "100%", minHeight: result ? "auto" : 320,
                background: dragging ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.025)",
                border: `1.5px dashed ${error ? "rgba(239,68,68,0.5)" : dragging ? "#a855f7" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 16, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: result ? 0 : "40px 32px",
                cursor: result || analyzing || file ? "default" : "pointer",
                transition: "all 0.2s", overflow: "hidden",
              }}
              onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
              onClick={result || analyzing || file ? undefined : onClick}
            >
              <input onChange={onFileChange} ref={inputRef} type="file"
                style={{ display: "none" }} accept={TAB_ACCEPTS[activeTab]} />

              {!file && !analyzing && !result && (
                <>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: "rgba(168,85,247,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16, fontSize: 26,
                  }}>{TAB_ICONS[activeTab]}</div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                    Drop your {activeTab.toLowerCase()} here
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 4px" }}>
                    or click to browse
                  </p>
                  <p style={{
                    fontSize: 12, color: "rgba(255,255,255,0.25)", margin: "8px 0 0",
                    fontFamily: "'DM Mono',monospace"
                  }}>
                    {TAB_HINT[activeTab]}
                  </p>
                </>
              )}

              {file && !analyzing && !result && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: "rgba(168,85,247,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                  }}>{TAB_ICONS[activeTab]}</div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>{file.name}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>{formatBytes(file.size)}</p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={(e) => { e.stopPropagation(); onAnalyze(); }} style={{
                      background: "linear-gradient(135deg,#a855f7,#7c3aed)", color: "#fff",
                      border: "none", borderRadius: 10, padding: "11px 28px",
                      fontSize: 14, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                      cursor: "pointer", boxShadow: "0 4px 16px rgba(168,85,247,0.4)",
                    }}>Analyze File</button>
                    <button onClick={(e) => { e.stopPropagation(); onReset(); }} style={{
                      background: "transparent", color: "rgba(255,255,255,0.4)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
                      padding: "11px 20px", fontSize: 14, fontFamily: "'Inter',sans-serif", cursor: "pointer",
                    }}>✕ Remove</button>
                  </div>
                </div>
              )}

              {analyzing && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 100, height: 100,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    {/* Pulsing rings */}
                    {[0, 0.6, 1.2].map((delay, i) => (
                      <div key={i} style={{
                        position: "absolute",
                        width: 64, height: 64,
                        borderRadius: "50%",
                        border: "1.5px solid rgba(168,85,247,0.5)",
                        animation: "radarPulse 1.8s ease-out infinite",
                        animationDelay: `${delay}s`,
                      }} />
                    ))}
                    {/* Center icon */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, position: "relative", zIndex: 1,
                      boxShadow: "0 4px 16px rgba(168,85,247,0.4)",
                    }}>
                      {TAB_ICONS[activeTab]}
                    </div>
                  </div>

                  <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>
                    Analysing your {activeTab.toLowerCase()}…
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "-10px 0 0", fontFamily: "'DM Mono',monospace" }}>
                    {file?.name}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "-10px 0 0" }}>
                    Running multi-model detection
                  </p>
                </div>
              )}

              {result && <ResultView result={result} file={file!} onReset={onReset} />}
            </div>

            <div style={{
              marginTop: "auto",
              paddingTop: 24,
              textAlign: "center",
              color: "rgba(196, 196, 196, 0.8)",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
            }}>
              © 2026 ID/AI Pty Ltd
            </div>
          </div>
        )}
      </div>
    </div>
  );
}