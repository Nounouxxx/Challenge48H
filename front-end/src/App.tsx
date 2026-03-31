// @ts-ignore
import { useState, useEffect } from "react";
// @ts-ignore
import Dijkstra from "./djikstra.jsx";
// @ts-ignore
import RavenPuzzle from "./raven-puzzle.jsx";
import ChallengePage from "./pages/ChallengePage";
import type { EnigmePage } from "./pages/ChallengePage";
import Enigme1 from "./pages/Enigme1";
import Enigme2 from "./pages/Enigme2";
import Enigme3 from "./pages/Enigme3";
import Enigme4 from "./pages/Enigme4";

type Scene = "challenge" | "dijkstra" | EnigmePage;

export default function App() {
  const [scene, setScene] = useState<Scene>("challenge");
  const [completedEnigmas, setCompletedEnigmas] = useState<number>(0);

  // Load completed enigmas from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("completedEnigmas");
    if (stored) {
      setCompletedEnigmas(parseInt(stored, 10));
    }
  }, []);

  const markEnigmaComplete = (enigmaNumber: number) => {
    const key = `enigma_${enigmaNumber}_completed`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "true");
      setCompletedEnigmas(prev => {
        const newCount = prev + 1;
        localStorage.setItem("completedEnigmas", newCount.toString());
        return newCount;
      });
    }
  };

  const isEnigmaCompleted = (enigmaNumber: number): boolean => {
    return localStorage.getItem(`enigma_${enigmaNumber}_completed`) === "true";
  };

  if (scene === "dijkstra") return <Dijkstra onBack={() => setScene("challenge")} completedCount={completedEnigmas} />;
  if (scene === "enigme1")  return <Enigme1 onBack={() => setScene("challenge")} isCompleted={isEnigmaCompleted(1)} onComplete={() => markEnigmaComplete(1)} />;
  if (scene === "enigme2")  return <Enigme2 onBack={() => setScene("challenge")} isCompleted={isEnigmaCompleted(2)} onComplete={() => markEnigmaComplete(2)} />;
  if (scene === "enigme3")  return <Enigme3 onBack={() => setScene("challenge")} isCompleted={isEnigmaCompleted(3)} onComplete={() => markEnigmaComplete(3)} />;
  if (scene === "enigme4")  return <Enigme4 onBack={() => setScene("challenge")} isCompleted={isEnigmaCompleted(4)} onComplete={() => markEnigmaComplete(4)} />;

  // default: challenge page
  return <ChallengePage onNavigate={(page) => setScene(page)} completedCount={completedEnigmas} />;
}