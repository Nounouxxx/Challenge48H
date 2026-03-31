import { checkAnswer, checkFinalAnswer } from "../services/enigma_service.js";

export const resolveFinalHandler = (req, res) => {
    if (req.body.input) {
        return res.status(200).json(checkFinalAnswer(req.body.input));
    }
    return res.status(400).send();
}

export const resolveHandler = (req, res) => {
    if (req.body.input && req.body.id) {
        return res.status(200).json(checkAnswer(req.body.input, req.body.id));
    }
    return res.status(500).json({"error": "Impossible de vérifié la réponse"});
}