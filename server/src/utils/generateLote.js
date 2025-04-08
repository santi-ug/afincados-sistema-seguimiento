/**
 * Helper function to generate the "lote" code.
 * Lote structure: [productCode (2 digits)] + [day (2 digits)] + [month (2 digits)] +
 * [sum of last two digits of year (2 digits)] + [employeeCode (2 digits)]
 */
function generateLote(productCode, dateStr, employeeCode) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear().toString();
  const lastTwo = year.slice(-2);
  const sumLastTwo = (parseInt(lastTwo[0]) + parseInt(lastTwo[1]))
    .toString()
    .padStart(2, "0");
  // Ensure productCode and employeeCode are two-digit strings (pad if necessary)
  const prodCode = String(productCode).padStart(2, "0");
  const empCode = String(employeeCode).padStart(2, "0");
  return `${prodCode}${day}${month}${sumLastTwo}${empCode}`;
}

export default generateLote;
