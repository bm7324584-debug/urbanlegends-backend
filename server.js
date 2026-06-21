require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// 🔥 IMPORTANTE: rutas de productos
const productoRoutes = require('./routes/productos');

const app = express();

// ===============================
// CONEXIÓN A MONGODB
// ===============================

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB conectado correctamente");
})
.catch((error) => {
    console.error("❌ Error al conectar MongoDB:");
    console.error(error);
});

// ===============================
// MIDDLEWARES
// ===============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔥 ESTA LÍNEA ARREGLA TODO (TU ERROR PRINCIPAL)
app.use('/api/productos', productoRoutes);

// Archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, "public")));

// Carpeta uploads (imágenes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// RUTA PRINCIPAL
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "galeria.html"));
});

// ===============================
// PUERTO
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
});