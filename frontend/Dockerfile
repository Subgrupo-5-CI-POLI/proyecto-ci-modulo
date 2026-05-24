# =============================================================================
#  Dockerfile del Frontend - Nginx sirviendo HTML/CSS/JS estático
# =============================================================================
#  Este Dockerfile construye una imagen muy ligera que usa Nginx para servir
#  los archivos estáticos del frontend. Nginx también actúa como proxy
#  inverso para las peticiones que el frontend hace al backend.
# =============================================================================

# PASO 1: Imagen base oficial de Nginx sobre Alpine Linux
# nginx:1.27-alpine pesa apenas ~25 MB
FROM nginx:1.27-alpine

# PASO 2: Metadatos
LABEL maintainer="Estudiante"
LABEL descripcion="Frontend estático servido por Nginx para el proyecto CI"

# PASO 3: Eliminar la configuración por defecto de Nginx
# para que solo se use nuestra propia configuración
RUN rm /etc/nginx/conf.d/default.conf

# PASO 4: Copiar nuestra configuración personalizada de Nginx
# (incluye el proxy inverso hacia el backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# PASO 5: Copiar los archivos estáticos del frontend al directorio
# que Nginx sirve por defecto
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# PASO 6: Exponer el puerto 80 (puerto estándar HTTP)
EXPOSE 80

# PASO 7: Healthcheck para que Docker verifique que Nginx esté sirviendo correctamente
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# PASO 8: Comando por defecto de la imagen nginx:alpine
# Lanza Nginx en primer plano (necesario para que el contenedor no termine)
CMD ["nginx", "-g", "daemon off;"]
