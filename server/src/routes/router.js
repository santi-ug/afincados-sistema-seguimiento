import { Router } from "express";
import archivoExcelRouter from "./archivo-excel.router.js";
import empleadoRouter from "./empleado.router.js";
import productoRouter from "./producto.router.js";
import registroRouter from "./registro.router.js";

const router = Router();

// Define routes with their respective prefixes
router.use("/empleados", empleadoRouter);
router.use("/productos", productoRouter);
router.use("/archivos-excel", archivoExcelRouter);
router.use("/registros", registroRouter);

export default router;
