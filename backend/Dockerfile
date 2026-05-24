# =============================================================================
#  Dockerfile del Backend - Node.js + Express
# =============================================================================
#  Este Dockerfile construye la imagen Docker que correrá nuestro servidor
#  Express. Usamos la imagen oficial "node:20-alpine" porque Alpine Linux es
#  una distribución muy ligera (~50 MB), lo que reduce el tiempo de build
#  y el tamaño final de la imagen.
# =============================================================================

# PASO 1: Imagen base
# Usamos Node.js 20 sobre Alpine Linux (versión específica para builds reproducibles)
FROM node:20-alpine

# PASO 2: Metadatos de la imagen (buena práctica)
LABEL maintainer="Estudiante"
LABEL descripcion="Backend Express del proyecto de Integración Continua"

# PASO 3: Definir el directorio de trabajo dentro del contenedor
# Todos los comandos siguientes se ejecutan dentro de /app
WORKDIR /app

# PASO 4: Copiar primero solo package.json y package-lock.json (si existe)
# Esto aprovecha el sistema de caché de capas de Docker: si las dependencias
# no cambian, Docker reutiliza la capa de "npm install" en builds posteriores
# y el build es MUCHO más rápido.
COPY package*.json ./

# PASO 5: Instalar dependencias en modo producción
# --omit=dev evita instalar dependencias de desarrollo
# --no-audit y --no-fund silencian mensajes innecesarios y aceleran el build
RUN npm install --omit=dev --no-audit --no-fund

# PASO 6: Copiar el resto del código fuente al contenedor
# Se hace DESPUÉS del npm install para aprovechar el caché de capas
COPY ./src ./src

# PASO 7: Exponer el puerto 3000 (informativo; el mapeo real lo hace docker-compose)
EXPOSE 3000

# PASO 8: Healthcheck nativo de Docker
# Docker ejecutará este comando cada 10s para verificar que el contenedor esté sano.
# IMPORTANTE: usamos 127.0.0.1 en lugar de "localhost" porque en Alpine Linux
# "localhost" puede resolver a IPv6 (::1), y nuestro servidor Node escucha en
# IPv4 (0.0.0.0). Usar 127.0.0.1 fuerza IPv4 y evita "Connection refused".
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# PASO 9: Comando que se ejecuta al iniciar el contenedor
# Usamos la forma "exec" (con array) para que Node reciba correctamente las señales del SO
CMD ["node", "src/server.js"]
