import { useState } from "react";
import { checkEnigmaAnswer } from "../api";

interface EnigmeProps {
  onBack: () => void;
  isCompleted?: boolean;
  onComplete?: () => void;
}

// Hash MD5 de "12345"
const MD5_HASH = "202cb962ac59075b964b07152d234b70";

export default function Enigme1({ onBack, isCompleted = false, onComplete }: EnigmeProps) {
  const [answer, setAnswer] = useState("");
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (loading || !answer.trim() || isCompleted) return;
    setLoading(true);
    try {
      const data = await checkEnigmaAnswer(1, answer.trim());
      if (data.success) {
        setApiResult(`✅ ${data.success}`);
        setSolved(true);
        onComplete?.();
      } else {
        setApiResult(`❌ ${data.error ?? "Incorrect"}`);
      }
    } catch {
      setApiResult("❌ Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
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
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        textAlign: "center", zIndex: 100,
      }}>
        <h1 style={{
          fontFamily: "monospace", fontSize: "1.5rem", color: "#00ffcc",
          marginBottom: 32,
        }}>🔐 MD5 Hash Cracker</h1>

        {isCompleted && (
          <div style={{
            background: "#001a14", border: "2px solid #00C9A7", borderRadius: 12,
            padding: 32, marginBottom: 32, fontFamily: "monospace",
            color: "#00C9A7", fontSize: "1.2rem",
          }}>
            ✅ Enigme déjà complétée !
          </div>
        )}

        <div style={{
          background: "#0a0a0a", border: "2px solid #00ffcc", borderRadius: 12,
          padding: 24, marginBottom: 24, fontFamily: "monospace",
          wordBreak: "break-all", color: "#00ffcc", fontSize: "0.9rem",
        }}>
          {MD5_HASH}
        </div>

        <p style={{
          color: "#aaa", fontSize: "0.95rem", marginBottom: 24,
          fontFamily: "monospace",
        }}>
          Pouvez-vous craquer ce hash MD5 ?
        </p>

        <input
          type="text"
          placeholder="Entrez le code décrypté..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !solved && !isCompleted && handleCheck()}
          disabled={solved || loading || isCompleted}
          style={{
            width: 280, padding: "12px 16px", marginBottom: 16,
            background: "#1a1a1a", border: "1px solid #00ffcc", color: "#00ffcc",
            borderRadius: 6, fontFamily: "monospace", fontSize: "1rem",
            outline: "none",
            opacity: isCompleted ? 0.5 : 1,
          }}
        />

        <button
          onClick={handleCheck}
          disabled={solved || loading || isCompleted}
          style={{
            display: "block", width: 280, padding: "12px 16px",
            background: isCompleted ? "#666" : (solved ? "#001a14" : "#00ffcc"), 
            color: isCompleted ? "#999" : (solved ? "#00ffcc" : "#000"),
            border: "none", borderRadius: 6, fontFamily: "monospace",
            fontSize: "1rem", fontWeight: "bold", cursor: isCompleted ? "not-allowed" : "pointer",
            marginTop: 8, marginLeft: "auto", marginRight: "auto",
          }}
        >
          {isCompleted ? "✓ Complétée" : (loading ? "..." : solved ? "✓ Résolu" : "Valider")}
        </button>
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
