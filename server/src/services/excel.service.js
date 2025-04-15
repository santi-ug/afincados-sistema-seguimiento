import ExcelJS from "exceljs";
import path from "path";

function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
}

async function buildLiberacionExcel(registros) {
  const workbook = new ExcelJS.Workbook();
  const templatePath = path.resolve(
    "src",
    "templates",
    "liberacion-template.xlsx"
  );
  await workbook.xlsx.readFile(templatePath);
  const worksheet = workbook.worksheets[0];

  let currentRow = 8;

  for (const registro of registros) {
    const row = worksheet.getRow(currentRow++);

    row.getCell(1).value = registro.fechaProduccion
      ? formatDateToDDMMYYYY(registro.fechaProduccion)
      : "";
    row.getCell(2).value = registro.producto?.nombre
      ? `${registro.producto.nombre} x${registro.cantidad || 0}`
      : "";
    row.getCell(3).value = registro.lote || "";
    row.getCell(6).value = registro.olor ? "✔" : "✘";
    row.getCell(5).value = registro.color ? "✔" : "✘";
    row.getCell(4).value = registro.sabor ? "✔" : "✘";
    row.getCell(7).value = registro.varProcesoConforme ? "✔" : "✘";
    row.getCell(8).value = registro.empaqueConforme ? "✔" : "✘";
    row.getCell(9).value = registro.libera ? "✔" : "✘";
    row.getCell(10).value = registro.accionesCorrectivas || "";
    row.getCell(11).value = registro.empleado?.nombre
      ? registro.empleado.nombre.includes("Diana")
        ? "Diana"
        : registro.empleado.nombre.includes("Jhon")
        ? "Jaime"
        : registro.empleado.nombre.includes("Maria")
        ? "Isabel"
        : (registro.empleado.nombre || "").split(" ")[0]
      : "";
    row.commit();
  }

  return workbook;
}

async function buildDespachoExcel(registros) {
  const workbook = new ExcelJS.Workbook();
  const templatePath = path.resolve(
    "src",
    "templates",
    "despachados-template.xlsx"
  );
  await workbook.xlsx.readFile(templatePath);
  const worksheet = workbook.worksheets[0];

  const footerRows = [worksheet.getRow(32), worksheet.getRow(33)];
  let currentRow = 8;

  for (const registro of registros) {
    if (currentRow >= 32) {
      worksheet.insertRow(currentRow, []); // Insert empty row to keep going
    }

    const row = worksheet.getRow(currentRow++);
    row.getCell(1).value = registro.fechaProduccion
      ? formatDateToDDMMYYYY(registro.fechaProduccion)
      : "";
    if (registro.producto?.categoria === "CONDIMENTO") {
      row.getCell(2).value = registro.producto?.nombre || "";
    } else if (registro.producto?.categoria === "HIERBAS") {
      row.getCell(3).value = registro.producto?.nombre || "";
    } else if (registro.producto?.categoria === "REPOSTERIA") {
      row.getCell(4).value = registro.producto?.nombre || "";
    }

    row.getCell(5).value = `${registro.gramaje || 0}gr`;

    if (registro.producto?.categoria === "CONDIMENTO") {
      row.getCell(6).value = "✔";
    } else if (registro.producto?.categoria === "HIERBAS") {
      row.getCell(7).value = "✔";
    } else if (registro.producto?.categoria === "REPOSTERIA") {
      row.getCell(8).value = "✔";
    }

    row.getCell(9).value = registro.empaqueVerificado ? "✔" : "✘";
    row.getCell(10).value = registro.paquetesCantidad || 0;
    row.getCell(11).value = registro.paquetesCantidad || 0;
    row.getCell(12).value = registro.accionResultado || "";
    row.getCell(13).value = registro.empleado?.nombre
      ? registro.empleado.nombre.includes("Diana")
        ? "Diana"
        : registro.empleado.nombre.includes("Jhon")
        ? "Jaime"
        : registro.empleado.nombre.includes("Maria")
        ? "Isabel"
        : (registro.empleado.nombre || "").split(" ")[0]
      : "";
    row.getCell(14).value = registro.cliente || "";
    row.commit();
  }

  // After all registros are inserted, move footers
  footerRows.forEach((footerRow) => {
    const newRow = worksheet.addRow([]);
    footerRow.eachCell((cell, colNumber) => {
      newRow.getCell(colNumber).value = cell.value;
      newRow.getCell(colNumber).style = { ...cell.style };
    });
    newRow.commit();
  });

  return workbook;
}

async function buildEmpaqueExcel(registros) {
  const workbook = new ExcelJS.Workbook();
  const templatePath = path.resolve(
    "src",
    "templates",
    "empaque-template.xlsx"
  );
  await workbook.xlsx.readFile(templatePath);
  const worksheet = workbook.worksheets[0];

  const footerRow = worksheet.getRow(30);
  let currentRow = 9;

  for (const registro of registros) {
    if (currentRow >= 30) {
      worksheet.insertRow(currentRow, []); // Insert empty row
    }

    const row = worksheet.getRow(currentRow++);
    row.getCell(1).value = registro.fechaProduccion
      ? formatDateToDDMMYYYY(registro.fechaProduccion)
      : "";
    row.getCell(2).value = registro.producto?.nombre || "";
    row.getCell(3).value = `${registro.cantidad || 0} und`;
    row.getCell(4).value = `${registro.gramaje || 0}gr`;
    row.getCell(6).value = registro.lote || "";
    row.getCell(7).value = registro.fechaVencimiento
      ? formatDateToDDMMYYYY(registro.fechaVencimiento)
      : "";
    row.getCell(8).value = registro.paramCalidadEmpaque ? "✔" : "✘";
    row.getCell(9).value = registro.paramCalidadPeso ? "✔" : "✘";
    row.getCell(10).value =
      registro.paramCalidadSinPresenciaDeSustanciasExtranas ? "✔" : "✘";
    row.getCell(11).value = registro.hora || "";
    row.getCell(12).value = registro.observaciones || "";
    row.commit();
  }

  // After registros inserted, move footer
  const newRow = worksheet.addRow([]);
  footerRow.eachCell((cell, colNumber) => {
    newRow.getCell(colNumber).value = cell.value;
    newRow.getCell(colNumber).style = { ...cell.style };
  });
  newRow.commit();

  return workbook;
}

export { buildDespachoExcel, buildEmpaqueExcel, buildLiberacionExcel };
