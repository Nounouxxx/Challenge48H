export const checkFinalAnswer = (input) => {
    if (input.toLowerCase() === "dijkstra") {
        return { success: "Bravo vous avez désamorcé la bombe" };
    }
    return { error: "Réponse invalide" };
};

// Réponses des 4 énigmes (indice : les premières lettres forment DIJKSTRA)
const ANSWERS = [
    "DISTANCE",  // Enigme 1 → D
    "INFINI",    // Enigme 2 → I
    "JALON",     // Enigme 3 → J
    "KRUSKAL",   // Enigme 4 → K
];

export const checkAnswer = (input, enigmaId) => {
    const expected = ANSWERS[enigmaId - 1];
    if (!expected) return { error: "Énigme inconnue" };
    if (input.toUpperCase().trim() === expected) {
        return { success: "Enigme validée" };
    }
    return { error: "Réponse invalide." };
};