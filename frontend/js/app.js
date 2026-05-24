/**
 * =============================================================================
 *  app.js - Lógica del frontend
 * =============================================================================
 *  Este script realiza peticiones HTTP al backend usando fetch().
 *
 *  IMPORTANTE - Sobre el hostname de las peticiones:
 *  Las peticiones se hacen a rutas RELATIVAS (ej: '/api/saludo'), NO a
 *  'http://backend:3000/api/saludo'. ¿Por qué?
 *
 *    - El código JavaScript se ejecuta en el navegador del usuario (en el HOST),
 *      no dentro del contenedor. Por lo tanto el navegador NO puede resolver
 *      el hostname "backend" (ese nombre solo existe dentro de la red Docker).
 *
 *    - La solución estándar es que Nginx actúe como PROXY INVERSO: el frontend
 *      pide '/api/saludo' al mismo servidor que sirvió la página (Nginx), y
 *      Nginx reenvía la petición internamente a http://backend:3000/api/saludo
 *      usando la red de Docker (donde el hostname "backend" sí se resuelve).
 *
 *  Así se cumple el requisito de comunicarse con el contenedor "backend"
 *  usando su nombre de servicio como hostname, y todo funciona desde el navegador.
 * =============================================================================
 */

// Esperamos a que el DOM esté completamente cargado antes de asociar eventos
document.addEventListener('DOMContentLoaded', () => {

  // Obtenemos referencias a los elementos del DOM
  const botonSaludo = document.getElementById('btnSaludo');
  const botonInfo = document.getElementById('btnInfo');
  const cajaResultadoSaludo = document.getElementById('resultadoSaludo');
  const cajaResultadoInfo = document.getElementById('resultadoInfo');

  // ---------------------------------------------------------------------------
  // Función genérica para hacer peticiones al backend
  // ---------------------------------------------------------------------------
  // - ruta: la ruta del endpoint a consultar (ej: '/api/saludo')
  // - cajaResultado: el elemento del DOM donde se mostrará la respuesta
  // - boton: el botón que se debe deshabilitar mientras carga
  async function llamarBackend(ruta, cajaResultado, boton) {

    // Mostramos estado de "cargando" en pantalla
    cajaResultado.className = 'resultado cargando';
    cajaResultado.textContent = '⏳ Llamando al backend...';
    boton.disabled = true;

    try {
      // Hacemos la petición HTTP. Nginx reenviará esta petición al contenedor "backend"
      const respuesta = await fetch(ruta);

      // Verificamos que la respuesta sea exitosa (código 2xx)
      if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}: ${respuesta.statusText}`);
      }

      // Parseamos el JSON de la respuesta
      const datos = await respuesta.json();

      // Mostramos el JSON formateado bonito en la caja de resultado
      cajaResultado.className = 'resultado exito';
      cajaResultado.textContent = JSON.stringify(datos, null, 2);

    } catch (error) {
      // Si algo falla (red caída, backend apagado, etc.), mostramos el error
      cajaResultado.className = 'resultado error';
      cajaResultado.textContent =
        '❌ Error al comunicarse con el backend:\n\n' + error.message +
        '\n\nVerifica que ambos contenedores estén corriendo (docker ps).';
      console.error('Error en fetch:', error);
    } finally {
      // Rehabilitamos el botón al terminar (éxito o error)
      boton.disabled = false;
    }
  }

  // ---------------------------------------------------------------------------
  // Asociamos los eventos click a cada botón
  // ---------------------------------------------------------------------------

  botonSaludo.addEventListener('click', () => {
    llamarBackend('/api/saludo', cajaResultadoSaludo, botonSaludo);
  });

  botonInfo.addEventListener('click', () => {
    llamarBackend('/api/info', cajaResultadoInfo, botonInfo);
  });

  // Mensaje en consola del navegador (útil para depurar en la sustentación)
  console.log('✅ Frontend cargado correctamente. Listo para llamar al backend.');
});
