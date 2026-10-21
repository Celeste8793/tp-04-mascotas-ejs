
"use strict";

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("node:path");
const { leerJSON } = require("./archivos");

const PUERTO = 3000;

async function iniciarServidor() {
  try {
    // Primero cargamos las mascotas desde el archivo JSON.
    const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");
    const mascotas = await leerJSON(rutaDatos);

    if (!Array.isArray(mascotas)) {
      throw new Error("El archivo mascotas.json debe contener un arreglo.");
    }

    const app = express();

    // Configuración del motor de plantillas EJS.
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));

    // Layout compartido por todas las páginas.
    app.use(expressLayouts);
    app.set("layout", "layouts/main");

    // Archivos CSS, JavaScript e imágenes.
    app.use(express.static(path.join(__dirname, "..", "public")));

    // Permite recibir datos de formularios HTML.
    app.use(express.urlencoded({ extended: false }));

    // Página de inicio.
    app.get("/", (req, res) => {
      res.render("inicio", {
        titulo: "Inicio | Huellitas",
      });
    });

    // Catálogo de mascotas.
    app.get("/mascotas", (req, res) => {
      res.render("mascotas/lista", {
        titulo: "Mascotas en adopción | Huellitas",
        mascotas,
      });
    });

    // Formulario para registrar una mascota.
    // Esta ruta debe ir ANTES de /mascotas/:id.
    app.get("/mascotas/nueva", (req, res) => {
      res.render("mascotas/nueva", {
        titulo: "Agregar mascota | Huellitas",
        error: null,
        valores: {},
      });
    });

    // Detalle de una mascota.
    app.get("/mascotas/:id", (req, res) => {
      const id = Number(req.params.id);
      const mascota = mascotas.find((item) => item.id === id);

      if (!mascota) {
        return res.status(404).render("no-encontrado", {
          titulo: "Mascota no encontrada | Huellitas",
        });
      }

      res.render("mascotas/detalle", {
        titulo: `${mascota.nombre} | Huellitas`,
        mascota,
      });
    });

    // Procesar el formulario.
    app.post("/mascotas", (req, res) => {
      const { nombre, especie, edad, estado, descripcion } = req.body;

      const valores = {
        nombre: typeof nombre === "string" ? nombre.trim() : "",
        especie: typeof especie === "string" ? especie.trim() : "",
        edad: typeof edad === "string" ? edad.trim() : "",
        estado: typeof estado === "string" ? estado.trim() : "",
        descripcion:
          typeof descripcion === "string" ? descripcion.trim() : "",
      };

      const edadNumero = Number(valores.edad);
      const estadosPermitidos = ["En adopción", "Reservada", "Adoptada"];

      const datosInvalidos =
        !valores.nombre ||
        !valores.especie ||
        !valores.edad ||
        !valores.estado ||
        !valores.descripcion ||
        !Number.isFinite(edadNumero) ||
        edadNumero < 0 ||
        !estadosPermitidos.includes(valores.estado);

      if (datosInvalidos) {
        return res.status(400).render("mascotas/nueva", {
          titulo: "Agregar mascota | Huellitas",
          error: "Completá todos los campos con datos válidos.",
          valores,
        });
      }

      const nuevoId =
        mascotas.reduce((mayor, mascota) => Math.max(mayor, mascota.id), 0) + 1;

      const nuevaMascota = {
        id: nuevoId,
        nombre: valores.nombre,
        especie: valores.especie,
        edad: edadNumero,
        estado: valores.estado,
        descripcion: valores.descripcion,
        imagen: "/img/mascota.svg",
      };

      // Se guarda solamente en memoria.
      mascotas.push(nuevaMascota);

      // Redirigimos al catálogo.
      return res.redirect("/mascotas");
    });

    // Página HTML para otras rutas inexistentes.
    app.use((req, res) => {
      res.status(404).render("no-encontrado", {
        titulo: "Página no encontrada | Huellitas",
      });
    });

    // El servidor comienza a escuchar después de cargar el JSON.
    app.listen(PUERTO, () => {
      console.log(`Huellitas disponible en http://localhost:${PUERTO}`);
      console.log("Visitá /mascotas para ver el catálogo.");
    });
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exitCode = 1;
  }
}

iniciarServidor();
