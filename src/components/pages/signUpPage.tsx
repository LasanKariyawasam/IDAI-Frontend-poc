import { useState } from "react";

interface SignUpProps {
  onSignUp: (email: string, password: string) => void;
  onGoSignIn: () => void;
}

export function SignUpPage({ onSignUp, onGoSignIn }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#0f0d1a",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; padding: 0; background: #0f0d1a; }
        .idai-input {
          width: 100%; padding: 12px 14px;
          width: 100%; padding: 12px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: #fff;
          font-size: 14px; font-family: 'Inter', sans-serif;
          outline: none; box-sizing: border-box;
          transition: border 0.2s;
        }
        .idai-input:focus { border-color: #a855f7; }
        .idai-input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40,
          background: "linear-gradient(135deg,#a855f7,#7c3aed)",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: "#fff",
        }}>ID/AI</div>
        <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>ID/AI</span>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 380,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18, padding: "32px 28px",
      }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Create an account</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 22px" }}>
          Start detecting deepfakes — 100 scans included
        </p>

        {/* Email */}
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "block", marginBottom: 6 }}>Email</label>
        <input
          className="idai-input"
          type="email" placeholder="you@example.com"
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {/* Password */}
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "block", marginBottom: 6 }}>Password</label>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            className="idai-input"
            type={showPass ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            style={{ paddingRight: 42 }}
          />
          <button onClick={() => setShowPass(s => !s)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.3)", padding: 0,
          }}>
            {showPass ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        {/* Confirm password */}
        <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, display: "block", marginBottom: 6 }}>Confirm password</label>
        <input
          className="idai-input"
          type="password" placeholder="Repeat password"
          value={confirm} onChange={e => setConfirm(e.target.value)}
          style={{ marginBottom: 22 }}
        />

        {/* Create account button */}
        <button
          onClick={() => onSignUp(email, password)}
          style={{
            width: "100%", padding: "13px",
            background: "linear-gradient(135deg,#a855f7,#7c3aed)",
            border: "none", borderRadius: 10,
            color: "#fff", fontSize: 15, fontWeight: 600,
            fontFamily: "'Inter',sans-serif", cursor: "pointer",
            boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
            marginBottom: 18,
          }}
        >Create account</button>

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Already have an account?{" "}
          <span onClick={onGoSignIn} style={{ color: "#b3ff00", fontWeight: 600, cursor: "pointer" }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}