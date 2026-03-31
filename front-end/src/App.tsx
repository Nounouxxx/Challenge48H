// @ts-ignore
import { useState } from "react";
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

  if (scene === "dijkstra") return <Dijkstra />;
  if (scene === "enigme1")  return <Enigme1 onBack={() => setScene("challenge")} />;
  if (scene === "enigme2")  return <Enigme2 onBack={() => setScene("challenge")} />;
  if (scene === "enigme3")  return <Enigme3 onBack={() => setScene("challenge")} />;
  if (scene === "enigme4")  return <Enigme4 onBack={() => setScene("challenge")} />;

  // default: challenge page
  return <ChallengePage onNavigate={(page) => setScene(page)} />;
}