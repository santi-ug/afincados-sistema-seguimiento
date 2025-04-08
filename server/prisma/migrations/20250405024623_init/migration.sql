-- AddForeignKey
ALTER TABLE "Registros" ADD CONSTRAINT "Registros_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registros" ADD CONSTRAINT "Registros_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registros" ADD CONSTRAINT "Registros_archivoExcelId_fkey" FOREIGN KEY ("archivoExcelId") REFERENCES "ArchivoExcels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
