export function CloudUploadIcon({ dragging }: { dragging: boolean }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path
        d="M14 36C9.582 36 6 32.418 6 28C6 23.582 9.582 20 14 20C14.34 20 14.675 20.02 15.005 20.059C16.318 15.416 20.568 12 25.625 12C31.845 12 36.875 17.03 36.875 23.25C36.875 23.39 36.87 23.528 36.862 23.666C37.074 23.639 37.288 23.625 37.5 23.625C41.366 23.625 44.5 26.759 44.5 30.625C44.5 34.491 41.366 37.625 37.5 37.625"
        stroke={dragging ? "#ccff00" : "#b3ff00"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M28 28L28 48M28 28L22 34M28 28L34 34"
        stroke={dragging ? "#ccff00" : "#b3ff00"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const isVideo = ["mp4", "mov"].includes(ext);
  const isAudio = ["mp3", "wav", "m4a"].includes(ext);
  const isPdf = ext === "pdf";
  const color = isVideo ? "#7c6fff" : isAudio ? "#ff6fb0" : isPdf ? "#ff9447" : "#b3ff00";
  
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 14,
      border: `1.5px solid ${color}44`, background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: 22 }}>{isVideo ? "🎬" : isAudio ? "🎵" : isPdf ? "📄" : "🖼️"}</span>
    </div>
  );
}