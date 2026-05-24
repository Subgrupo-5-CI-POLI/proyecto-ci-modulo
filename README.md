# 🐳 Proyecto CI - Entrega 1: Comunicación entre dos contenedores Docker

Proyecto académico del módulo **Proyecto de software basado en herramientas de integración continua**.

Este repositorio contiene la **Entrega 1 (Semana 3)** del proyecto, cuyo objetivo es demostrar el uso de **Docker** como herramienta de integración continua mediante la construcción de **dos contenedores comunicados entre sí**.

---

## 📋 Tabla de contenidos

1. [Arquitectura](#arquitectura)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos previos](#requisitos-previos)
5. [Cómo levantar el proyecto](#cómo-levantar-el-proyecto)
6. [Cómo probar los endpoints](#cómo-probar-los-endpoints)
7. [Cómo verificar la comunicación entre contenedores](#cómo-verificar-la-comunicación-entre-contenedores)
8. [Cómo detener el proyecto](#cómo-detener-el-proyecto)
9. [Comandos Docker útiles](#comandos-docker-útiles)

---

## 🏗️ Arquitectura

```
                  ┌─────────────────────────────────────────┐
                  │           Red Docker: red-ci            │
                  │                                         │
   Usuario        │   ┌──────────────┐    ┌──────────────┐  │
  (Navegador) ────┼──▶│   FRONTEND   │───▶│   BACKEND    │  │
   Puerto 8080    │   │   Nginx      │    │   Node.js    │  │
                  │   │   Puerto 80  │    │   Puerto 3000│  │
                  │   └──────────────┘    └──────────────┘  │
                  │       (proxy)             (API REST)    │
                  └─────────────────────────────────────────┘
```

- El **usuario** accede al frontend desde su navegador en `http://localhost:8080`.
- El **frontend** (Nginx) sirve los archivos estáticos y actúa como **proxy inverso**: cuando el JavaScript del navegador hace `fetch('/api/...')`, Nginx reenvía esa petición al backend a través de la red interna de Docker.
- El **backend** (Node.js + Express) responde con datos en formato JSON.
- Ambos contenedores están en la misma **red bridge personalizada** llamada `red-ci`, lo que les permite resolverse mutuamente por **nombre de servicio** (DNS interno de Docker).

---

## 🛠️ Stack tecnológico

| Componente   | Tecnología                  | Imagen Docker     |
|--------------|-----------------------------|-------------------|
| Frontend     | HTML + CSS + JS vanilla     | `nginx:1.27-alpine` |
| Backend      | Node.js + Express           | `node:20-alpine`  |
| Orquestación | Docker Compose              | -                 |
| Red          | Bridge personalizada        | `red-ci`          |

---

## 📁 Estructura del proyecto

```
proyecto-ci-modulo/
├── backend/
│   ├── src/
│   │   └── server.js          # Servidor Express con los endpoints
│   ├── package.json           # Dependencias del backend
│   ├── .dockerignore
│   └── Dockerfile             # Construcción del contenedor backend
├── frontend/
│   ├── index.html             # Página principal
│   ├── css/styles.css         # Estilos
│   ├── js/app.js              # Llamadas fetch al backend
│   ├── nginx.conf             # Config Nginx con proxy inverso
│   └── Dockerfile             # Construcción del contenedor frontend
├── docker-compose.yml         # Orquestación de los dos contenedores
├── .gitignore
└── README.md
```

---

## ✅ Requisitos previos

- **Docker Desktop** instalado y corriendo.
  - Descarga: <https://www.docker.com/products/docker-desktop/>
  - Verifica la instalación con:
    ```bash
    docker --version
    docker-compose --version
    ```
- **Git** instalado para clonar el repositorio.

> **No necesitas instalar Node.js, Nginx ni nada más localmente.** Todo corre dentro de contenedores Docker.

---

## 🚀 Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/proyecto-ci-modulo.git
cd proyecto-ci-modulo
```

### 2. Levantar los contenedores

Con un **solo comando** levantas todo el proyecto:

```bash
docker-compose up --build
```

- `--build` fuerza a Docker a reconstruir las imágenes (útil la primera vez o cuando cambias código).
- Para correr en segundo plano (detached), agrega `-d`:
  ```bash
  docker-compose up --build -d
  ```

### 3. Abrir en el navegador

Ve a **<http://localhost:8080>** y verás la página del frontend. Presiona los botones para llamar al backend.

---

## 🧪 Cómo probar los endpoints

### Desde el navegador (a través del frontend)
1. Abre <http://localhost:8080>.
2. Pulsa **"Llamar al backend"** → ejecuta `GET /api/saludo`.
3. Pulsa **"Obtener info del contenedor"** → ejecuta `GET /api/info`.

### Desde la terminal (a través del proxy de Nginx)
```bash
curl http://localhost:8080/api/saludo
curl http://localhost:8080/api/info
```

---

## 🔍 Cómo verificar la comunicación entre contenedores

### Ver los contenedores corriendo
```bash
docker ps
```

### Ver los logs en tiempo real
```bash
docker-compose logs -f
```

### Entrar al contenedor frontend y verificar que llega al backend por su nombre
```bash
docker exec -it frontend-ci sh
# Dentro del contenedor:
wget -qO- http://backend:3000/api/saludo
exit
```
Si recibes el JSON, **la comunicación entre contenedores funciona correctamente**.

### Ver la red Docker creada
```bash
docker network inspect red-ci
```

---

## 🛑 Cómo detener el proyecto

### Detener pero conservar los contenedores
```bash
docker-compose stop
```

### Detener y eliminar contenedores y red (no borra las imágenes)
```bash
docker-compose down
```

### Detener, eliminar contenedores, red e imágenes construidas
```bash
docker-compose down --rmi all
```

---

## 📚 Comandos Docker útiles

| Comando | Descripción |
|---------|-------------|
| `docker ps` | Lista contenedores en ejecución |
| `docker ps -a` | Lista todos los contenedores (incluso detenidos) |
| `docker images` | Lista imágenes locales |
| `docker logs <contenedor>` | Ver logs de un contenedor |
| `docker exec -it <contenedor> sh` | Entrar a un contenedor |
| `docker-compose up --build` | Construir y levantar todo |
| `docker-compose down` | Detener y eliminar todo |
| `docker network ls` | Listar redes Docker |
| `docker system prune` | Limpiar recursos no usados |

---

## 👤 Autores

Edwin Alexander Villa Castañeda |
Brayan Dulcey Sandoval

## 📄 Licencia

MIT
