import { useState } from "react";
import "../challenge.css";
import { checkEnigmaAnswer } from "../api";

interface EnigmeProps {
  onBack: () => void;
}

export default function Enigme4({ onBack }: EnigmeProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [isError, setIsError] = useState(false);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (loading || !answer.trim()) return;
    setLoading(true);
    try {
      const data = await checkEnigmaAnswer(4, answer.trim());
      if (data.success) {
        setResult(`✅ ${data.success}`);
        setIsError(false);
        setSolved(true);
      } else {
        setResult(`❌ ${data.error ?? "Incorrect"}`);
        setIsError(false);
        requestAnimationFrame(() => setIsError(true));
      }
    } catch {
      setResult("❌ Erreur réseau");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enigme-page">
      <h1>🔐 Énigme 4 — L’arbre couvrant</h1>
      <p>
        Un concurrent de Dijkstra pour construire un arbre couvrant minimal porte le nom de
        l’algorithme de <em>________</em>.
      </p>
      <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>
        Indice : cet algorithme trie les arêtes par poids croissant avant de les sélectionner.
      </p>

      <input
        type="text"
        placeholder="Votre réponse..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !solved && handleCheck()}
        disabled={solved}
        style={{ marginTop: 24 }}
      />
      <button onClick={handleCheck} disabled={solved || loading} style={{ marginTop: 12 }}>
        {loading ? "..." : "Valider"}
      </button>

      {result && (
        <div className={isError ? "error" : ""} style={{ marginTop: 16, fontSize: "1.2rem" }}>
          {result}
        </div>
      )}

      <button className="back-btn" onClick={onBack}>← Retour</button>
    </div>
  );
}
