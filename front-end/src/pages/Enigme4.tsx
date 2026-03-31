import { useState } from "react";
import { checkEnigmaAnswer } from "../api";

interface EnigmeProps {
  onBack: () => void;
  isCompleted?: boolean;
  onComplete?: () => void;
}

// Mapping couleurs vers morse
const MORSE_MAP: Record<string, string> = {
  red: ".-.",      // R
  blue: "-...",    // B
  green: "--.",    // G
  yellow: "-.--",  // Y
};

// Inverse mapping
const COLORS = ["red", "blue", "green", "yellow"];
const correctColor = COLORS[Math.floor(Math.random() * COLORS.length)];
const morseHint = MORSE_MAP[correctColor];

export default function Enigme4({ onBack, isCompleted = false, onComplete }: EnigmeProps) {
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCutWire = async (color: string) => {
    if (failed || solved || loading || isCompleted) return;
    
    setLoading(true);
    
    if (color === correctColor) {
      try {
        const data = await checkEnigmaAnswer(4, color);
        if (data.success) {
          setApiResult(`✅ ${data.success}`);
          setSolved(true);
          onComplete?.();
        } else {
          setApiResult(`❌ ${data.error ?? "Incorrect"}`);
          setFailed(true);
        }
      } catch {
        setApiResult("❌ Erreur réseau");
        setFailed(true);
      }
    } else {
      setApiResult("❌ Mauvais fil coupé!");
      setFailed(true);
    }
    
    setLoading(false);
  };

  const morseDisplay = morseHint
    .split("")
    .map((char) => (char === "." ? "●" : "━"))
    .join(" ");

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: "#0a0a0a", overflow: "hidden" }}>
      <button
        onClick={onBack}
        style={{
          position: "fixed", top: 16, left: 16, zIndex: 1000,
          padding: "8px 18px", background: "transparent",
          border: "1px solid #00ffcc", color: "#00ffcc",
          fontFamily: "monospace", fontSize: "0.9rem", cursor: "pointer",
        }}
      >
        ← Retour
      </button>

      {/* Morse Hint */}
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 1000,
        padding: "8px 16px", background: "#1a1a1a",
        border: "1px solid #00ffcc", color: "#00ffcc",
        fontFamily: "monospace", fontSize: "0.85rem", cursor: "default",
        opacity: isCompleted ? 0.5 : 1,
      }}>
        {morseDisplay}
      </div>

      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        textAlign: "center", zIndex: 100,
      }}>
        <h1 style={{
          fontFamily: "monospace", fontSize: "1.5rem", color: "#00ffcc",
          marginBottom: 32,
        }}>💣 Désamorce le Piège</h1>

        {isCompleted && (
          <div style={{
            background: "#001a14", border: "2px solid #00C9A7", borderRadius: 12,
            padding: 32, marginBottom: 32, fontFamily: "monospace",
            color: "#00C9A7", fontSize: "1.2rem",
          }}>
            ✅ Enigme déjà complétée !
          </div>
        )}

        <p style={{
          color: "#aaa", fontSize: "0.95rem", marginBottom: 48,
          fontFamily: "monospace",
          opacity: isCompleted ? 0.5 : 1,
        }}>
          Décode le morse et coupe le bon fil...
        </p>

        {/* Wires */}
        <div style={{
          display: "flex", gap: 32, justifyContent: "center", alignItems: "flex-end",
          marginBottom: 48,
        }}>
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleCutWire(color)}
              disabled={failed || solved || loading || isCompleted}
              style={{
                width: 40, height: 150, backgroundColor: color,
                border: "2px solid #333", borderRadius: 8,
                cursor: (failed || solved || isCompleted) ? "not-allowed" : "pointer",
                opacity: (failed && color !== correctColor) || isCompleted ? 0.3 : 1,
                transition: "all 0.2s ease",
                fontSize: "0.8rem", color: "#fff", fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {color}
            </button>
          ))}
        </div>

        <div style={{
          fontSize: "1.2rem", fontFamily: "monospace",
          color: failed ? "#FF6B9D" : "#00ffcc",
          minHeight: "30px",
        }}>
          {isCompleted ? "✅ Énigme complétée" : (failed ? "⚠️ Énigme échouée - vous ne pouvez plus rejouer" : "")}
        </div>
      </div>

      {apiResult && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: solved ? "#001a14" : "#1a0008",
          border: `2px solid ${solved ? "#00C9A7" : "#FF6B9D"}`,
          color: solved ? "#00C9A7" : "#FF6B9D",
          padding: "14px 32px", borderRadius: 12,
          fontFamily: "monospace", fontSize: 16, fontWeight: 700,
          zIndex: 1000, whiteSpace: "nowrap",
        }}>
          {apiResult}
        </div>
      )}
    </div>
  );
}
