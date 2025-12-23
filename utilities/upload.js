// Importa el módulo path de Node.js
// Se usa para construir rutas de archivos de forma segura
const path = require("path");

// Importa multer, el middleware que maneja subida de archivos
const multer = require("multer");

// ===============================
// CONFIGURACIÓN DEL ALMACENAMIENTO
// ===============================

// diskStorage le dice a multer que guarde los archivos en el disco
const storage = multer.diskStorage({
  // Define la carpeta destino donde se guardarán las imágenes
  destination: (req, file, cb) => {
    // __dirname → carpeta actual del archivo
    // ".." → sube un nivel
    // public/images/services → carpeta final
    cb(null, path.join(__dirname, "..", "public", "images", "services"));
  },

  // Define cómo se va a llamar el archivo guardado
  filename: (req, file, cb) => {
    // Obtiene la extensión original del archivo (.png, .jpg, etc.)
    const ext = path.extname(file.originalname).toLowerCase();

    // Obtiene el nombre base del archivo SIN la extensión
    const safeBase = path
      .basename(file.originalname, ext)

      // Reemplaza cualquier caracter raro por "_"
      // Evita espacios, tildes, símbolos peligrosos
      .replace(/[^a-z0-9-_]/gi, "_")

      // Pasa todo a minúsculas
      .toLowerCase();

    // Nombre final:
    // timestamp + "_" + nombre seguro + extensión
    // Ejemplo: 1700000000000_manicure_pink.webp
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

// ===============================
// FILTRO DE ARCHIVOS
// ===============================

// Esta función decide si el archivo se acepta o se rechaza
function fileFilter(req, file, cb) {
  // Lista de tipos MIME permitidos
  const allowed = ["image/png", "image/jpeg", "image/webp"];

  // Si el tipo del archivo NO está permitido
  if (!allowed.includes(file.mimetype)) {
    // Se devuelve un error y se rechaza el archivo
    return cb(new Error("Only PNG, JPG, or WebP images are allowed."), false);
  }

  // Si el archivo es válido, se acepta
  cb(null, true);
}

// ===============================
// CONFIGURACIÓN FINAL DE MULTER
// ===============================

const upload = multer({
  // Usa la configuración de almacenamiento definida arriba
  storage,

  // Usa el filtro de tipos de archivo
  fileFilter,

  // Limita el tamaño máximo del archivo
  limits: {
    fileSize: 70 * 1024, // 70 KB
  },
});

// ===============================
// EXPORTACIÓN
// ===============================

// Exporta el middleware upload para usarlo en las rutas
module.exports = upload;
