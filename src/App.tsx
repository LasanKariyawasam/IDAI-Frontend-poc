import { useRef, useState } from "react";
import { useFileAnalyzer } from "./components/hooks/useFileAnalyzer";
import { FileUpload } from "./components/models/fileUpload";
import { appStyles } from "./components/styles/appStyles";
import { SignInPage } from "./components/pages/signInPage";
import { SignUpPage } from "./components/pages/signUpPage";

type AppView = "signin" | "signup" | "app";

export default function App() {
  const { file, error, analyzing, result, handleFile, analyzeFile, reset } = useFileAnalyzer();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<AppView>("signin");

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onClick = () => !file && inputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  if (view === "signin") return (
    <SignInPage
      onSignIn={() => setView("app")}
      onGoSignUp={() => setView("signup")}
    />
  );

  if (view === "signup") return (
    <SignUpPage
      onSignUp={() => setView("app")}
      onGoSignIn={() => setView("signin")}
    />
  );

  return (
    <div style={appStyles.root}>
      <header style={appStyles.header}>
        <div style={appStyles.logo}>
          <span style={appStyles.logoText}>ID/AI</span>
          <span style={{ fontSize: 11, marginLeft: 8, color: "rgba(255,255,255,0.4)" }}>Detection Portal</span>
        </div>
        <a href="https://idai.ai" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← Back</a>
      </header>

      <main style={appStyles.main}>
        <FileUpload
          dragging={dragging}
          file={file}
          analyzing={analyzing}
          result={result}
          error={error}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={onClick}
          onAnalyze={analyzeFile}
          onReset={reset}
          inputRef={inputRef}
          onFileChange={onFileChange}
          onSignOut={() => setView("signin")}
        />
        {error && <div style={{ marginTop: 14, color: "#ff6b81", fontSize: 13 }}>⚠ {error}</div>}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d14; }
        @keyframes cloudFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes progressSlide { 0%{width:0%} 30%{width:45%} 70%{width:72%} 100%{width:92%} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.95)} }
      `}</style>
    </div>
  );
}