export const checkFinalAnswer = (input) => {
    if (input.toLowerCase() === "dijkstra") {
        return {'success': "Bravo vous avez désamorcé la bombe"};
    }
    return {"error" : "Réponse invalide"};
}

export const checkAnswer = (input, enigmaId) => {
    const answers = ["","","",""];
    if (input === answers[enigmaId -1]) {
        return {"success": "Enigme validée"};
    }
    return {"error": "Réponse invalide."}
}