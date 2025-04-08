import { Router } from "express";
import ProductoController from "../controllers/producto.controller.js";

const router = Router();
const productoController = new ProductoController();

router.get("/", productoController.getAll);
router.get("/:id", productoController.getById);
router.post("/", productoController.create);
router.put("/:id", productoController.update);
router.delete("/:id", productoController.delete);

export default router;
