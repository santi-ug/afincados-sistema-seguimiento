import { Router } from "express";
import RegistroController from "../controllers/registro.controller.js";

const router = Router();
const registroController = new RegistroController();

router.get("/", registroController.getAll);
router.get("/:id", registroController.getById);
router.put("/bulk-update", registroController.bulkUpdate);
router.put("/:id", registroController.update);
router.delete("/:id", registroController.delete);
router.post("/download-excel", registroController.downloadExcel);
router.get("/archivo/:archivoExcelId", registroController.getByArchivoExcelId);

export default router;
