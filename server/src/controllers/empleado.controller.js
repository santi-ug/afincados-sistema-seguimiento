import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class EmpleadoController {
  async create(req, res) {
    try {
      const { nombre } = req.body;
      const empleado = await prisma.empleados.create({
        data: {
          nombre,
        },
      });
      res.status(201).json(empleado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const empleados = await prisma.empleados.findMany({
        include: {
          Registros: true,
        },
      });
      res.json(empleados);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const empleado = await prisma.empleados.findUnique({
        where: { id: parseInt(id) },
        include: {
          Registros: true,
        },
      });
      if (!empleado) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }
      res.json(empleado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const empleado = await prisma.empleados.update({
        where: { id: parseInt(id) },
        data: {
          nombre,
        },
      });
      res.json(empleado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.empleados.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRegistrosByEmpleadoId(req, res) {
    try {
      const { id } = req.params;
      const empleado = await prisma.empleados.findUnique({
        where: { id: parseInt(id) },
        include: {
          Registros: true,
        },
      });
      if (!empleado) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }
      res.json(empleado.Registros);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default EmpleadoController;
