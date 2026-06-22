import { CSSProperties } from "react";

export const appStyles: Record<string, CSSProperties> = {
  root: {
    minHeight: "100vh", background: "#0a0d14",
    fontFamily: "'Syne',sans-serif", color: "#e8eaf0",
    display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "relative", zIndex: 10,
  },
  logo: { display: "flex", alignItems: "baseline", gap: 2 },
  logoText: { fontWeight: 800, fontSize: 20, color: "#fff" },
  logoAI: { fontWeight: 800, fontSize: 20, color: "#b3ff00" },
  main: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    padding: "20px 24px 32px", position: "relative", zIndex: 10,
  },
  title: { 
    fontSize: "clamp(32px,5vw,48px)", 
    fontWeight: 700, 
    color: "#fff", 
    textAlign: "center", 
    marginBottom: 10,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
    letterSpacing: "-0.02em",
  },
  subtitle: { fontSize: 16, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 36, maxWidth: 480 },
  footer: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "18px 32px", borderTop: "1px solid rgba(255,255,255,0.06)",
    fontSize: 12, color: "rgba(255,255,255,0.3)", position: "relative", zIndex: 10,
  },
};