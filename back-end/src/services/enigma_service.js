export const checkFinalAnswer = (input) => {
    if (input.toLowerCase() === "dijkstra") {
        return { success: "Bravo vous avez désamorcé la bombe" };
    }
    return { error: "Réponse invalide" };
};

// Réponses des 4 énigmes
const ANSWERS = [
    "DISTANCE",  // Enigme 1
    "INFINI",    // Enigme 2
    "6742",      // Enigme 3 — code final de la Matrice de Raven
    "KRUSKAL",   // Enigme 4
];

export const checkAnswer = (input, enigmaId) => {
    const expected = ANSWERS[enigmaId - 1];
    if (!expected) return { error: "Énigme inconnue" };
    if (input.toUpperCase().trim() === expected) {
        return { success: "Enigme validée" };
    }
    return { error: "Réponse invalide." };
};