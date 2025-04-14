// src/lib/prisma.js
import { PrismaClient } from "@prisma/client";

import {
  buildDespachoExcel,
  buildEmpaqueExcel,
  buildLiberacionExcel,
} from "../services/excel.service.js";

async function generateTestExcels() {
  const prisma = new PrismaClient();
  try {
    // 🔥 Aquí traes tu registro real
    const registros = await prisma.registros.findMany({
      include: {
        producto: true, // para traer el nombre del producto
        empleado: true, // para traer el nombre del empleado
      },
      take: 1, // solo 1 registro si quieres limitar
    });

    if (registros.length === 0) {
      console.error("❌ No registros found in DB.");
      return;
    }

    // 🔥 Ahora usas los registros reales
    const liberacion = await buildLiberacionExcel(registros);
    const despacho = await buildDespachoExcel(registros);
    const empaque = await buildEmpaqueExcel(registros);

    // Save each Excel
    await liberacion.xlsx.writeFile("./output/test-liberacion.xlsx");
    await despacho.xlsx.writeFile("./output/test-despacho.xlsx");
    await empaque.xlsx.writeFile("./output/test-empaque.xlsx");

    console.log("✅ Excels generated inside /output folder!");
  } catch (error) {
    console.error("❌ Error generating test excels:", error);
  }
}

generateTestExcels();
