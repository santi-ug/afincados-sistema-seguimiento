import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RegistroController {
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
  async update(req, res) {
    try {
      const { id } = req.params;
      const { empleadoId, fechaProduccion, lote, fechaVencimiento } = req.body;

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
