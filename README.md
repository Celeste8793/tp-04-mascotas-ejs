
# Trabajo práctico 04

## Descripción

Huellitas es una aplicación web educativa desarrollada con Node.js, Express y EJS.

Su objetivo es mostrar un catálogo de mascotas, consultar sus detalles y registrar nuevas mascotas mediante un formulario HTML.

La aplicación utiliza un archivo JSON con cinco mascotas iniciales y permite agregar otras temporalmente mientras el servidor está funcionando.

## Tecnologías utilizadas

- Node.js
- Express
- EJS
- express-ejs-layouts
- HTML5
- CSS3
- JavaScript
- JSON

## Instalación

1. Descargar o clonar el repositorio.
2. Abrir una terminal en la carpeta principal del proyecto.
3. Instalar las dependencias:

```bash
npm install
```

En PowerShell, si existe una restricción para ejecutar `npm`, se puede utilizar:

```powershell
npm.cmd install
```

## Ejecución

Para iniciar el servidor:

```bash
npm start
```

En PowerShell:

```powershell
npm.cmd start
```

Una vez iniciado, abrir en el navegador:

http://localhost:3000

Para comprobar la sintaxis de los archivos principales:

```powershell
npm.cmd run check
```

## Páginas y rutas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Muestra la página de inicio. |
| GET | `/mascotas` | Muestra el catálogo de mascotas. |
| GET | `/mascotas/nueva` | Muestra el formulario de registro. |
| GET | `/mascotas/:id` | Muestra los detalles de una mascota. |
| POST | `/mascotas` | Recibe y valida los datos de una nueva mascota. |

Las rutas inexistentes y los identificadores de mascotas no encontrados muestran una página personalizada con estado HTTP 404.

## Estructura de vistas

El proyecto utiliza EJS para generar las páginas HTML desde el servidor.

- `views/layouts/main.ejs`: plantilla general del sitio.
- `views/partials/encabezado.ejs`: encabezado y menú de navegación.
- `views/partials/pie.ejs`: pie de página.
- `views/inicio.ejs`: página principal.
- `views/mascotas/lista.ejs`: catálogo de mascotas.
- `views/mascotas/detalle.ejs`: información completa de una mascota.
- `views/mascotas/nueva.ejs`: formulario de registro.
- `views/no-encontrado.ejs`: página de error 404.

El layout contiene la estructura HTML común a todas las páginas.

Las vistas contienen el contenido específico de cada página.

Los partials permiten reutilizar el encabezado y el pie sin repetir su código.

La función `res.render()` de Express procesa las vistas EJS y les envía los datos necesarios.

## Recursos estáticos

Los archivos públicos están organizados dentro de la carpeta `public`:

- `public/css/estilos.css`: estilos y diseño adaptable.
- `public/js/app.js`: JavaScript del navegador.
- `public/img/mascota.svg`: imagen local utilizada por las mascotas.

Express utiliza `express.static()` para permitir que el navegador acceda a estos recursos.

## Formulario

La página `/mascotas/nueva` permite registrar una mascota mediante los siguientes campos:

- Nombre.
- Especie.
- Edad.
- Estado de adopción.
- Descripción.

El formulario utiliza el método POST y envía los datos a `/mascotas`.

Express utiliza `express.urlencoded({ extended: false })` para interpretar los datos enviados desde formularios HTML.

El servidor comprueba que:

- Los campos obligatorios no estén vacíos.
- La edad sea un número válido mayor o igual a cero.
- El estado corresponda a `En adopción`, `Reservada` o `Adoptada`.

Si los datos son incorrectos, el servidor devuelve HTTP 400, muestra un mensaje de error y conserva los valores ingresados.

Si los datos son correctos, genera un identificador numérico, agrega la mascota al catálogo y redirige a `/mascotas`.

Este comportamiento sigue el patrón POST-Redirect-GET: después de un registro exitoso, el navegador realiza una nueva solicitud GET al catálogo.

## Persistencia de los datos

Las mascotas iniciales se encuentran en `datos/mascotas.json`.

El archivo se lee de forma asíncrona mediante `node:fs/promises`, antes de iniciar el servidor.

Las mascotas agregadas desde el formulario se almacenan únicamente en memoria.

Por lo tanto, al detener y reiniciar la aplicación, las mascotas agregadas temporalmente desaparecen y se vuelven a cargar las cinco mascotas originales.

El formulario no modifica el archivo JSON.

## Pruebas realizadas

Se comprobó el funcionamiento de:

- La página de inicio.
- El catálogo de mascotas.
- El formulario de registro.
- El registro exitoso de una nueva mascota.
- La visualización de sus detalles.
- La página personalizada de error 404.
- La validación de una edad negativa desde el navegador.
- La validación del servidor con respuesta HTTP 400.
- La conservación de los valores del formulario ante un error.
- La recuperación de los datos originales después de reiniciar el servidor.

## Autoría

Proyecto realizado con fines educativos para el Trabajo Práctico N.º 04 de desarrollo web con Node.js, Express y EJS.
