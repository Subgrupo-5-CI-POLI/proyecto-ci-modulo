/**
 * =============================================================================
 *  Servidor Backend - API REST con Express
 * =============================================================================
 *  Este archivo levanta un servidor HTTP que expone dos endpoints REST.
 *  El servidor corre dentro de un contenedor Docker llamado "backend" y se
 *  comunica con el contenedor "frontend" a través de una red interna de Docker.
 *
 *  Endpoints expuestos:
 *    GET /api/saludo  -> Devuelve un mensaje de bienvenida en formato JSON.
 *    GET /api/info    -> Devuelve información del contenedor (hostname, fecha,
 *                        versión de Node, plataforma, uptime, etc.).
 * =============================================================================
 */

// Importamos Express, el framework web minimalista para Node.js
const express = require('express');

// Importamos CORS para permitir peticiones desde otros orígenes
// (útil durante pruebas; en producción Nginx hace de proxy y CORS no es necesario)
const cors = require('cors');

// Importamos el módulo "os" nativo de Node para obtener datos del sistema/contenedor
const os = require('os');

// Creamos la aplicación Express
const app = express();

// El puerto se toma de la variable de entorno PORT (definida en docker-compose.yml).
// Si no existe, usamos 3000 por defecto.
const PUERTO = process.env.PORT || 3000;

// -----------------------------------------------------------------------------
// MIDDLEWARES
// -----------------------------------------------------------------------------

// Habilita CORS para todas las rutas (cualquier origen puede hacer peticiones)
app.use(cors());

// Permite que Express interprete cuerpos de petición en formato JSON
app.use(express.json());

// Middleware de logging: imprime cada petición que llega al servidor.
// Esto es muy útil para demostrar en la sustentación que el frontend
// SÍ se está comunicando con el backend a través de la red de Docker.
app.use((req, res, next) => {
  const fechaHora = new Date().toISOString();
  console.log(`[${fechaHora}] ${req.method} ${req.url} - desde ${req.ip}`);
  next();
});

// -----------------------------------------------------------------------------
// ENDPOINT 1: GET /api/saludo
// -----------------------------------------------------------------------------
// Devuelve un mensaje de saludo simple en formato JSON.
// Sirve para demostrar que el frontend puede consumir el API.
app.get('/api/saludo', (req, res) => {
  res.json({
    mensaje: '¡Hola desde el backend Node.js! 👋',
    descripcion: 'Esta respuesta viene del contenedor "backend" a través de la red interna de Docker.',
    timestamp: new Date().toISOString()
  });
});

// -----------------------------------------------------------------------------
// ENDPOINT 2: GET /api/info
// -----------------------------------------------------------------------------
// Devuelve información técnica del contenedor donde corre este servidor.
// El "hostname" será el ID del contenedor Docker, lo cual demuestra
// claramente que la respuesta proviene de un contenedor aislado.
app.get('/api/info', (req, res) => {
  res.json({
    hostname: os.hostname(),                    // ID del contenedor Docker
    plataforma: os.platform(),                  // Sistema operativo (linux)
    arquitectura: os.arch(),                    // Arquitectura del CPU
    versionNode: process.version,               // Versión de Node.js en uso
    fecha: new Date().toLocaleString('es-CO'),  // Fecha y hora formateada
    uptimeSegundos: Math.floor(process.uptime()), // Segundos desde que arrancó el servidor
    memoriaLibreMB: Math.round(os.freemem() / 1024 / 1024) // Memoria RAM libre en MB
  });
});

// -----------------------------------------------------------------------------
// ENDPOINT DE SALUD (healthcheck)
// -----------------------------------------------------------------------------
// Endpoint usado por Docker para verificar que el contenedor esté "sano".
// Docker llama a esta ruta periódicamente; si responde 200, el contenedor
// está marcado como "healthy" y el frontend puede empezar a depender de él.
app.get('/api/health', (req, res) => {
  res.status(200).json({ estado: 'ok' });
});

// -----------------------------------------------------------------------------
// MANEJO DE RUTAS NO ENCONTRADAS
// -----------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    rutaSolicitada: req.originalUrl,
    rutasDisponibles: ['/api/saludo', '/api/info', '/api/health']
  });
});

// -----------------------------------------------------------------------------
// ARRANQUE DEL SERVIDOR
// -----------------------------------------------------------------------------
// IMPORTANTE: escuchamos en 0.0.0.0 (no en 127.0.0.1) para que el servidor
// acepte conexiones desde fuera del contenedor (es decir, desde otros
// contenedores en la misma red de Docker, como el frontend).
app.listen(PUERTO, '0.0.0.0', () => {
  console.log('===========================================');
  console.log(`  Backend escuchando en el puerto ${PUERTO}`);
  console.log(`  Hostname del contenedor: ${os.hostname()}`);
  console.log(`  Fecha de arranque: ${new Date().toISOString()}`);
  console.log('===========================================');
});
