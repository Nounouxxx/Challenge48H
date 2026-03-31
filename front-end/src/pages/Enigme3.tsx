import { useState } from "react";
import { checkEnigmaAnswer } from "../api";
// @ts-ignore
import RavenPuzzle from "../raven-puzzle.jsx";

interface EnigmeProps {
  onBack: () => void;
}

export default function Enigme3({ onBack }: EnigmeProps) {
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  const handleSolved = async (code: string) => {
    try {
      const data = await checkEnigmaAnswer(3, code);
      if (data.success) {
        setApiResult(`✅ ${data.success}`);
        setSolved(true);
      } else {
        setApiResult(`❌ ${data.error ?? "Code invalide"}`);
      }
    } catch {
      setApiResult("❌ Erreur réseau");
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

      <RavenPuzzle onSolved={handleSolved} />

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
