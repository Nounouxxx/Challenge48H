import { resolveFinalHandler, resolveHandler } from "../controllers/enigma_controller.js";
import { Router } from "express";

var router = Router();

router.post("/enigma/resolveFinal", resolveFinalHandler);
router.post("/enigma/resolve", resolveHandler)

export default router;