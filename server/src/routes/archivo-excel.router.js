import { Router } from "express";
import { upload } from "../config/multer.config.js";
import ArchivoExcelController from "../controllers/archivo-excel.controller.js";

const router = Router();
const archivoExcelController = new ArchivoExcelController();

router.post(
  "/upload",
  upload.single("excelFile"),
  archivoExcelController.handleFileUpload
);
router.get("/", archivoExcelController.getAll);
router.get("/:id", archivoExcelController.getById);
router.delete("/:id", archivoExcelController.delete);

export default router;
