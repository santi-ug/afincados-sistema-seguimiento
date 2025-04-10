import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ProductoController {
  async create(req, res) {
    try {
      const { nombre, gramajes, categoria } = req.body;

      // 1. Check if a producto with the same nombre already exists
      const existingProducto = await prisma.productos.findFirst({
        where: {
          nombre: {
            equals: nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), // normalize and remove accents
            mode: "insensitive", // so "ajo", "Ajo", and "ajó" are treated the same
          },
        },
      });

      if (existingProducto) {
        return res
          .status(400)
          .json({ error: "Ya existe un producto con ese nombre." });
      }

      // 2. Get the last product ID and calculate the new ID
      const lastProducto = await prisma.productos.findFirst({
        orderBy: {
          id: "desc",
        },
      });

      const lastId = lastProducto ? lastProducto.id : "C0";
      const numericPart = parseInt(lastId.slice(1), 10);
      const newId = `C${numericPart + 1}`;

      // 3. Capitalize the first letter of every word in the nombre
      const capitalizeWords = (str) =>
        str
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      const formattedNombre = capitalizeWords(nombre);

      // 4. Create the new producto
      const producto = await prisma.productos.create({
        data: {
          id: newId,
          nombre: formattedNombre,
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

      // 1. Check if a producto with the same nombre already exists (excluding the current producto)
      const existingProducto = await prisma.productos.findFirst({
        where: {
          nombre: {
            equals: nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), // normalize and remove accents
            mode: "insensitive", // so "ajo", "Ajo", and "ajó" are treated the same
          },
          NOT: {
            id, // exclude the current producto by ID
          },
        },
      });

      if (existingProducto) {
        return res
          .status(400)
          .json({ error: "Ya existe un producto con ese nombre." });
      }

      // 2. Capitalize the first letter of every word in the nombre
      const capitalizeWords = (str) =>
        str
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      const formattedNombre = capitalizeWords(nombre);

      // 3. Update the producto
      const producto = await prisma.productos.update({
        where: { id },
        data: {
          nombre: formattedNombre,
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
