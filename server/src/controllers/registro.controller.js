import { PrismaClient } from "@prisma/client";
import {
  buildDespachoExcel,
  buildEmpaqueExcel,
  buildLiberacionExcel,
} from "../services/excel.service.js";

const prisma = new PrismaClient();

class RegistroController {
  async downloadExcel(req, res) {
    const { startDate, endDate, format } = req.body;

    console.log("Fechas recibidas:", startDate, endDate);

    const colombiaOffset = "-05:00";
    const start = new Date(`${startDate}T00:00:00${colombiaOffset}`);
    const end = new Date(`${endDate}T23:59:59${colombiaOffset}`);

    const registros = await prisma.registros.findMany({
      where: {
        fechaProduccion: {
          gte: start,
          lte: end,
        },
      },
      include: {
        producto: true,
        empleado: true,
      },
      orderBy: {
        rowNumber: "asc", // ✅ ordenar por fila original del Excel
      },
    });

    console.log("Registros obtenidos:", registros);

    let workbook;
    if (format === "liberacion") {
      workbook = await buildLiberacionExcel(registros);
    } else if (format === "despacho") {
      workbook = await buildDespachoExcel(registros);
    } else if (format === "empaque") {
      workbook = await buildEmpaqueExcel(registros);
    } else {
      return res.status(400).json({ error: "Formato inválido." });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=registros-${format}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  }

  async getAll(req, res) {
    try {
      const registros = await prisma.registros.findMany({
        include: {
          empleado: true,
          producto: true,
        },
      });
      res.json(registros);
    } catch (error) {
      console.error("Error obteniendo registros:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const registro = await prisma.registros.findUnique({
        where: { id: parseInt(id) },
        include: {
          empleado: true,
          producto: true,
        },
      });
      if (!registro) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      res.json(registro);
    } catch (error) {
      console.error("Error obteniendo registro:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getByArchivoExcelId(req, res) {
    const { archivoExcelId } = req.params;
    const registros = await prisma.registros.findMany({
      where: {
        archivoExcelId: parseInt(archivoExcelId),
      },
      include: {
        producto: true,
        empleado: true,
      },
    });
    res.json(registros);
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        empleadoId,
        fechaProduccion,
        lote,
        fechaVencimiento,
        materialType,
        condVerificado,
        hierbasVerificado,
        reposteriaVerificado,
        empaqueVerificado,
        paquetesCantidad,
        accionResultado,
        cliente,
        paramCalidadEmpaque,
        paramCalidadPeso,
        paramCalidadSinPresenciaDeSustanciasExtranas,
        hora,
        observaciones,
        olor,
        color,
        sabor,
        varProcesoConforme,
        empaqueConforme,
        libera,
        accionesCorrectivas,
        nombreProducto,
      } = req.body;

      const registroActualizado = await prisma.registros.update({
        where: { id: parseInt(id) },
        data: {
          empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
          fechaProduccion: fechaProduccion
            ? new Date(fechaProduccion)
            : undefined,
          lote: lote || undefined,
          fechaVencimiento: fechaVencimiento
            ? new Date(fechaVencimiento)
            : undefined,
          materialType: materialType || undefined,
          condVerificado,
          hierbasVerificado,
          reposteriaVerificado,
          empaqueVerificado,
          paquetesCantidad,
          accionResultado,
          cliente,
          paramCalidadEmpaque,
          paramCalidadPeso,
          paramCalidadSinPresenciaDeSustanciasExtranas,
          hora: hora,
          observaciones,
          olor,
          color,
          sabor,
          varProcesoConforme,
          empaqueConforme,
          libera,
          accionesCorrectivas,
          nombreProducto,
        },
      });

      res.json({
        message: "Registro actualizado correctamente.",
        registro: registroActualizado,
      });
    } catch (error) {
      console.error("Error actualizando registro:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async bulkUpdate(req, res) {
    console.log("Entrando a bulkUpdate...");

    try {
      const { registros } = req.body;

      console.log("Registros recibidos en backend:", registros);

      console.log(
        "Registros recibidos en backend:",
        JSON.stringify(registros, null, 2)
      );

      if (!Array.isArray(registros) || registros.length === 0) {
        return res.status(400).json({ error: "No registros provided." });
      }

      const updatePromises = registros.map((registro) => {
        return prisma.registros.update({
          where: { id: registro.id },
          data: {
            empleadoId: registro.empleadoId
              ? parseInt(registro.empleadoId)
              : undefined,
            fechaProduccion: registro.fechaProduccion
              ? new Date(registro.fechaProduccion)
              : undefined,
            lote: registro.lote || undefined,
            fechaVencimiento: registro.fechaVencimiento
              ? new Date(registro.fechaVencimiento)
              : undefined,
            materialType: registro.materialType || undefined,
            condVerificado: registro.condVerificado,
            hierbasVerificado: registro.hierbasVerificado,
            reposteriaVerificado: registro.reposteriaVerificado,
            empaqueVerificado: registro.empaqueVerificado,
            paquetesCantidad: registro.paquetesCantidad,
            accionResultado: registro.accionResultado,
            cliente: registro.cliente,
            paramCalidadEmpaque: registro.paramCalidadEmpaque,
            paramCalidadPeso: registro.paramCalidadPeso,
            paramCalidadSinPresenciaDeSustanciasExtranas:
              registro.paramCalidadSinPresenciaDeSustanciasExtranas,
            hora: registro.hora,
            observaciones: registro.observaciones,
            olor: registro.olor,
            color: registro.color,
            sabor: registro.sabor,
            varProcesoConforme: registro.varProcesoConforme,
            empaqueConforme: registro.empaqueConforme,
            libera: registro.libera,
            accionesCorrectivas: registro.accionesCorrectivas,
            nombreProducto: registro.nombreProducto,
          },
        });
      });

      await Promise.all(updatePromises);

      res.json({ message: "Registros actualizados correctamente." });
    } catch (error) {
      console.error("Error en actualización masiva:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.registros.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      console.error("Error eliminando registro:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default RegistroController;
