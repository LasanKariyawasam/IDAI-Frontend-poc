import { useState, useMemo, CSSProperties } from "react";

//Types

type MediaType  = "Image" | "Video" | "Audio";
type ResultType = "ai" | "real" | "uncertain";

export interface DetectionRecord {
  id: string;
  name: string;
  type: MediaType;
  date: string;        
  displayDate: string; 
  result: ResultType;
  probability: number; 
}

// Hardcoded seed data for development and UI testing.
// TODO: remove MOCK_RECORDS and replace the useState below with:
//   const [records, setRecords] = useState<DetectionRecord[]>([]);
//   useEffect(() => { fetch("/api/history").then(r => r.json()).then(setRecords); }, []);

const MOCK_RECORDS: DetectionRecord[] = [
  { id: "1", name: "portrait_edit.jpg",      type: "Image", date: "2026-06-16", displayDate: "16 June 2026", result: "ai",        probability: 87 },
  { id: "2", name: "meeting_recording.mp4",  type: "Video", date: "2026-06-13", displayDate: "13 June 2026", result: "real",      probability: 14 },
  { id: "3", name: "podcast_clip.mp3",       type: "Audio", date: "2026-06-11", displayDate: "11 June 2026", result: "uncertain", probability: 62 },
  { id: "4", name: "family_photo.png",       type: "Image", date: "2026-06-08", displayDate: "8 June 2026",  result: "real",      probability: 9  },
  { id: "5", name: "interview_deepfake.mp4", type: "Video", date: "2026-06-04", displayDate: "4 June 2026",  result: "ai",        probability: 93 },
  { id: "6", name: "voicemail_suspect.wav",  type: "Audio", date: "2026-05-31", displayDate: "31 May 2026",  result: "uncertain", probability: 45 },
  { id: "7", name: "id_document_scan.webp",  type: "Image", date: "2026-05-27", displayDate: "27 May 2026",  result: "ai",        probability: 78 },
  { id: "8", name: "cctv_footage.mov",       type: "Video", date: "2026-05-21", displayDate: "21 May 2026",  result: "real",      probability: 31 },
];

// Sub-components

function StatCard({ label, value, sub, accent = false }: {
  label: string; value: string; sub: string; accent?: boolean;
}) {
  return (
    <div style={{ background: "#16132e", border: "0.5px solid #2e2a55", borderRadius: 10, padding: "1rem 1.25rem" }}>
      <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#7a76a8", textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 600, color: accent ? "#c4ff00" : "#e8e6ff", lineHeight: 1, marginBottom: 6 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: "#5a567a", display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 14, height: 1.5, background: "#5a567a", display: "inline-block" }} />
        {sub}
      </p>
    </div>
  );
}

// Icons and badges
function FileTypeIcon({ type }: { type: MediaType }) {
  const map: Record<MediaType, { bg: string; color: string; symbol: string }> = {
    Image: { bg: "#2a1545", color: "#a855f7", symbol: "🖼" },
    Video: { bg: "#12233a", color: "#5b9bd5", symbol: "▶" },
    Audio: { bg: "#1a2a1a", color: "#22c55e", symbol: "♪" },
  };
  const { bg, color, symbol } = map[type];
  return (
    <span style={{
      width: 32, height: 32, borderRadius: 6, background: bg, color,
      fontSize: 15, display: "inline-flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}>
      {symbol}
    </span>
  );
}

// Result Badge Component
function ResultBadge({ result }: { result: ResultType }) {
  const map: Record<ResultType, { bg: string; color: string; dot: string; label: string }> = {
    ai:        { bg: "#2d1414", color: "#f87171", dot: "#f87171", label: "Likely AI-generated" },
    real:      { bg: "#122d1c", color: "#4ade80", dot: "#4ade80", label: "Likely Real" },
    uncertain: { bg: "#2d2010", color: "#fbbf24", dot: "#fbbf24", label: "Uncertain" },
  };
  const { bg, color, dot, label } = map[result];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: bg, color, fontSize: 11, fontWeight: 500,
      padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function ProbabilityText({ result, value }: { result: ResultType; value: number }) {
  const color: Record<ResultType, string> = { ai: "#f87171", real: "#4ade80", uncertain: "#fbbf24" };
  return <span style={{ color: color[result], fontWeight: 600, fontSize: 13 }}>{value}%</span>;
}

function DonutChart({ real, uncertain, ai }: { real: number; uncertain: number; ai: number }) {
  const total = real + uncertain + ai || 1;
  const cx = 50, cy = 50, r = 38, sw = 12;

  function arc(startDeg: number, deg: number) {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(startDeg + deg));
    const y2 = cy + r * Math.sin(toRad(startDeg + deg));
    return `M ${x1} ${y1} A ${r} ${r} 0 ${deg > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  }

  const slices = [
    { value: real,      color: "#4ade80" },
    { value: uncertain, color: "#fbbf24" },
    { value: ai,        color: "#f87171" },
  ];
  let cursor = 0;

  return (
    <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width={100} height={100}>
        {slices.map((s, i) => {
          const deg = (s.value / total) * 360;
          const d = arc(cursor, deg - 1.5);
          cursor += deg;
          return <path key={i} d={d} fill="none" stroke={s.color} strokeWidth={sw} strokeLinecap="round" />;
        })}
      </svg>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", textAlign: "center",
      }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#e8e6ff", lineHeight: 1 }}>{real + uncertain + ai}</div>
        <div style={{ fontSize: 10, color: "#7a76a8" }}>total</div>
      </div>
    </div>
  );
}

// Main Export

export function HistoryView() {
  const records = MOCK_RECORDS;
  // TODO: replace above with API fetch and add pagination for large datasets.

  const [filterType,   setFilterType]   = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [filterFrom,   setFilterFrom]   = useState("");
  const [filterTo,     setFilterTo]     = useState("");

  const filtered = useMemo(() => records.filter(r => {
    if (filterType   !== "all" && r.type   !== filterType)  return false;
    if (filterResult !== "all" && r.result !== filterResult) return false;
    if (filterFrom   && r.date < filterFrom)                 return false;
    if (filterTo     && r.date > filterTo)                   return false;
    return true;
  }), [records, filterType, filterResult, filterFrom, filterTo]);

  const stats = useMemo(() => {
    const real      = records.filter(r => r.result === "real").length;
    const uncertain = records.filter(r => r.result === "uncertain").length;
    const ai        = records.filter(r => r.result === "ai").length;
    const aiRate    = records.length ? Math.round((ai / records.length) * 100) : 0;
    return { real, uncertain, ai, aiRate };
  }, [records]);

  // TODO: pull from user/account API
  const creditsTotal = 100;
  const creditsUsed  = 8;

  const inputStyle: CSSProperties = {
    background: "#0d0b1e", border: "0.5px solid #2e2a55",
    borderRadius: 6, color: "#ccc8f0", fontSize: 13,
    padding: "6px 10px", outline: "none", fontFamily: "inherit",
  };

  const cardStyle: CSSProperties = {
    background: "#16132e", border: "0.5px solid #2e2a55",
    borderRadius: 10, padding: "1.25rem", marginBottom: "1.25rem",
  };

  const gridCols = "2fr 1.2fr 1.2fr 1fr 80px";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <h1 style={{ color: "#e8e6ff", fontSize: 22, fontWeight: "bold", margin: "0 0 4px"}}>History</h1>
      <p style={{ color: "#7a76a8", fontSize: 13, marginBottom: "1.5rem" }}>
        Your detection history and analytics.
      </p>

      {/* Stat Cards*/}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: "1.25rem" }}>
        <StatCard label="Total Analyses · Last 30 Days" value={String(records.length)} sub="No prior data" />
        <StatCard label="Credits Remaining" value={`${creditsTotal - creditsUsed} of ${creditsTotal}`} sub={`${creditsUsed} used`} accent />
        <StatCard label="AI Detection Rate · Last 30 Days" value={`${stats.aiRate}%`} sub="No prior data" accent />
      </div>

      {/* Distribution Chart*/}
      <div style={cardStyle}>
        <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#7a76a8", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          Analysis Distribution · Last 30 Days
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <DonutChart real={stats.real} uncertain={stats.uncertain} ai={stats.ai} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { color: "#4ade80", label: "Likely Real",         count: stats.real,      pct: Math.round((stats.real      / records.length) * 100) },
              { color: "#fbbf24", label: "Uncertain",           count: stats.uncertain, pct: Math.round((stats.uncertain / records.length) * 100) },
              { color: "#f87171", label: "Likely AI-generated", count: stats.ai,        pct: Math.round((stats.ai        / records.length) * 100) },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#ccc8f0" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                  {row.label}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  <span style={{ color: "#ccc8f0", fontWeight: 500 }}>{row.count}</span>
                  <span style={{ color: "#7a76a8" }}>{row.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*Filters*/}
      <div style={{ ...cardStyle, borderRadius: "10px 10px 0 0", marginBottom: 1 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Type",   value: filterType,   setter: setFilterType,
              options: [["all","All types"],["Image","Image"],["Video","Video"],["Audio","Audio"]], width: 130 },
            { label: "Result", value: filterResult, setter: setFilterResult,
              options: [["all","All results"],["ai","Likely AI-generated"],["real","Likely Real"],["uncertain","Uncertain"]], width: 160 },
          ].map(({ label, value, setter, options, width }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "#7a76a8" }}>{label}</label>
              <select style={{ ...inputStyle, minWidth: width }} value={value} onChange={e => setter(e.target.value)}>
                {options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
              </select>
            </div>
          ))}
          {[
            { label: "Date from", value: filterFrom, setter: setFilterFrom },
            { label: "Date to",   value: filterTo,   setter: setFilterTo   },
          ].map(({ label, value, setter }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "#7a76a8" }}>{label}</label>
              <input type="date" style={{ ...inputStyle, minWidth: 140 }} value={value} onChange={e => setter(e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Table*/}
      <div style={{ background: "#16132e", border: "0.5px solid #2e2a55", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
        {/* Head */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols, padding: "8px 1.25rem", borderBottom: "0.5px solid #2e2a55", background: "#120f28" }}>
          {["Detection", "Uploaded On", "Result", "Probability", "Actions"].map(h => (
            <div key={h} style={{ fontSize: 10, letterSpacing: "0.08em", color: "#7a76a8", textTransform: "uppercase" as const }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#5a567a", fontSize: 13 }}>
            No results match your filters.
          </div>
        ) : filtered.map(r => (
          <div key={r.id} style={{
            display: "grid", gridTemplateColumns: gridCols,
            padding: "12px 1.25rem", borderBottom: "0.5px solid #1e1b38", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileTypeIcon type={r.type} />
              <div>
                <div style={{ fontSize: 13, color: "#e8e6ff", fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#7a76a8" }}>{r.type}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#9994c0" }}>{r.displayDate}</div>
            <div><ResultBadge result={r.result} /></div>
            <div><ProbabilityText result={r.result} value={r.probability} /></div>
            <div>
              <button
                style={{
                  background: "transparent", border: "0.5px solid #2e2a55",
                  borderRadius: 6, color: "#ccc8f0", fontSize: 12,
                  padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                }}
                onClick={() => {
                  // TODO: navigate(`/detect/result/${r.id}`)
                  console.log("View record:", r.id);
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ padding: "10px 1.25rem", fontSize: 12, color: "#5a567a", borderTop: "0.5px solid #2e2a55" }}>
          {filtered.length} of {records.length} results
        </div>
      </div>
    </div>
  );
}