import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ProductoController {
  async create(req, res) {
    try {
      const { nombre, gramajes, categoria } = req.body;

      // Get the last product ID and calculate the new ID
      const lastProducto = await prisma.productos.findFirst({
        orderBy: {
          id: "desc",
        },
      });

      const lastId = lastProducto ? lastProducto.id : "C0";
      const numericPart = parseInt(lastId.slice(1), 10);
      const newId = `C${numericPart + 1}`;

      const producto = await prisma.productos.create({
        data: {
          id: newId,
          nombre,
          gramajes,
          categoria,
        },
      });

      res.status(201).json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const productos = await prisma.productos.findMany({
        include: {
          Registros: true,
        },
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const producto = await prisma.productos.findUnique({
        where: { id },
        include: {
          Registros: true,
        },
      });
      if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, gramajes, categoria } = req.body;
      const producto = await prisma.productos.update({
        where: { id },
        data: {
          nombre,
          gramajes,
          categoria,
        },
      });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await prisma.productos.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProductoController;
