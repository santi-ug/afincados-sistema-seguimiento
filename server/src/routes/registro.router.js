import { Router } from "express";
import RegistroController from "../controllers/registro.controller.js";

const router = Router();
const registroController = new RegistroController();

router.get("/", registroController.getAll);
router.get("/:id", registroController.getById);
router.put("/:id", registroController.update);
router.delete("/:id", registroController.delete);

export default router;
