import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";
import generateLote from "../utils/generateLote.js";

const prisma = new PrismaClient();

class ArchivoExcelController {
  async handleFileUpload(req, res) {
    try {
      const file = req.file;
      if (!file)
        return res.status(400).json({ error: "Archivo no adjuntado." });

      // 1. Crear un ArchivoExcel primero
      const archivoExcel = await prisma.archivoExcels.create({
        data: {
          filePath: file.path,
        },
      });

      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      for (const row of jsonData) {
        const { nombre, cantidad } = row;

        if (!nombre) {
          console.warn(`Falta nombre en la fila: ${JSON.stringify(row)}`);
          continue;
        }
        if (!cantidad) {
          console.warn(`Falta cantidad en la fila: ${JSON.stringify(row)}`);
          continue;
        }

        const match = nombre.match(/^(.*?)(\d.*)$/);
        let productName = match ? match[1].trim() : nombre.trim();
        const gramaje = match ? match[2].replace("GR", "").trim() : null;

        const nombreBuscado = productName
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .toLowerCase();

        const productosDb = await prisma.productos.findMany({
          select: {
            id: true,
            nombre: true,
          },
        });

        const product = productosDb.find((p) => {
          const nombreDb = p.nombre
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase();
          return nombreDb.includes(nombreBuscado);
        });

        if (!product) {
          console.warn(`Producto no encontrado: "${productName}"`);
          continue;
        }

        // 2. Crear un Registro asociado al ArchivoExcel
        await prisma.registros.create({
          data: {
            productoId: product.id, // 🚀 ID explícito
            cantidad: parseInt(cantidad),
            gramaje: parseInt(gramaje),
            archivoExcelId: archivoExcel.id, // 🚀 ID explícito
            // empleadoId: ...  (esto lo agregas cuando llegues a empleados)
          },
        });
      }

      return res.status(200).json({
        message: "Archivo procesado correctamente.",
        filePath: file.path,
      });
    } catch (error) {
      console.error("Error procesando archivo", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAll(req, res) {
    try {
      const archivosExcel = await prisma.archivoExcels.findMany({
        include: {
          Registros: true, // Include associated Registros
        },
      });
      res.json(archivosExcel);
    } catch (error) {
      console.error("Error fetching all archivosExcel:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const archivoExcel = await prisma.archivoExcels.findUnique({
        where: { id: parseInt(id) },
        include: {
          Registros: true, // Include associated Registros
        },
      });
      if (!archivoExcel) {
        return res.status(404).json({ message: "Archivo Excel no encontrado" });
      }
      res.json(archivoExcel);
    } catch (error) {
      console.error("Error fetching archivoExcel by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.registros.deleteMany({
        where: { archivoExcelId: parseInt(id) }, // Delete associated Registros first
      });
      await prisma.archivoExcels.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting archivoExcel:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default ArchivoExcelController;
