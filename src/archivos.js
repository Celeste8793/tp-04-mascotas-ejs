"use strict";

const fs = require("node:fs/promises");

async function leerJSON(rutaArchivo) {
  const contenido = await fs.readFile(rutaArchivo, "utf8");
  return JSON.parse(contenido);
}

module.exports = { leerJSON };