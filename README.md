# School No-Borders

Sistema de inicio de sesión y registro para gestión de notas de estudiantes. Proyecto de práctica enfocado en dominar HTML/CSS/JS vanilla antes de escalar a un backend real con ASP.NET Core, EF Core y SQL Server.

## Project Preview

Proyecto en accion:

### Interfaz de registro e inicio de sección
![Login Screen](/images/login-view.png)

### Modo Oscuro
![Dark Mode View](/images/dark-mode.png)

### Modal-card 
![Modal-Card](/images/modal.card.png)

### Estructura CSS
![CSS](/images/CSS.png)

## Idea del proyecto

En lugar de un registro libre, el sistema simula el flujo real de un colegio: la cédula (DNI) ya existe precargada en el sistema, y el usuario "reclama" su cuenta creando su propia contraseña la primera vez que entra, en vez de que el colegio le entregue una clave genérica.

Por ahora, los datos precargados viven en un archivo JSON estático (`Students.json`), y el estado de "quién ya se registró" vive en `localStorage` del navegador. Es una decisión deliberada: primero se domina la lógica de manipulación de datos y DOM con JS puro, y más adelante el mismo frontend se conecta a una API real.

## Roadmap general (fuera de este repo)

Este proyecto es el punto de partida de un stack más grande que se va a ir armando por etapas:

1. **Actual** — HTML + CSS + JS vanilla, datos precargados en JSON y estado de registro en `localStorage`
2. **Siguiente** — ASP.NET Core Web API + EF Core + SQL Server como backend real, JWT para autenticación
3. **Más adelante** — TypeScript / React, Tailwind, Docker, Azure

## Estado actual

La pantalla de login/registro (primer sprint) está terminada. Lo que sigue es el dashboard de estudiante y el manejo de roles.

### Hecho

- **Estructura HTML** completa: `login-container` con dos formularios (`box-login`, `box-register`) y un panel deslizante (`toggle-box`), todos superpuestos con `position: absolute` dentro del mismo contenedor.
- **Formularios:**
  - Login (`id="loginForm"`): DNI + contraseña
  - Register (`id="registerForm"`): nombre + DNI + contraseña + confirmar contraseña (sin selector de rol libre; se decidió que el rol debe venir precargado junto al DNI, no elegido por el usuario, para evitar que cualquiera se autoasigne como profesor)
- **CSS modular:**
  - Estilos separados por responsabilidad en seis archivos (ver estructura de carpetas), enlazados en un orden deliberado en el `<head>`
  - Variables CSS en `:root` para la fuente, el color de acento, el efecto vidrio y los gradientes principales
  - Tarjeta centrada con Flexbox, capas superpuestas controladas por `opacity` + `position: absolute`
  - Inputs modernos con íconos (Font Awesome) centrados vía wrapper (`input-wrapper` con `position: relative`)
  - Panel `toggle-box` con gradiente propio, tipografía Montserrat (vía `@import` de Google Fonts) y botones tipo "outline" con `:hover`
  - `:focus` personalizado en los inputs
  - Efecto glassmorphism en `login-container` (`background` translúcido, `backdrop-filter: blur()`, borde sutil) sobre una imagen de fondo de campus universitario
  - Animación de transición entre Login/Register con `@keyframes` (efecto "ola": el panel se expande al 100% del ancho a mitad de camino y se contrae del lado opuesto), más `transition: opacity` para el fade del texto
  - Modo oscuro funcional, con ícono dinámico (sol/luna) que cambia según el estado
- **JavaScript — UI (`main.js`):**
  - Toggle funcional entre modo Login/Register vía `classList.add/remove('active')` en el contenedor
  - Bug resuelto: clics bloqueados por paneles invisibles superpuestos (`pointer-events: none/auto` según el panel activo)
  - Bug resuelto: animación indebida al recargar la página (clase `was-active` para distinguir "primera carga" de "cambio real de estado")
- **JavaScript — lógica de autenticación:**
  - `Students.json` (`/src/data`): datos precargados de estudiantes, con los campos `dni` y `name` (nombres en inglés para mantener consistencia con la propiedad `DNI` de `Student.cs` en el backend planeado)
  - `passwordService.js` (`/src/services`): servicio de infraestructura aislado, responsable únicamente de hashear y comparar contraseñas con bcryptjs (cargado vía CDN). Expone `hashPassword(plainPassword)` y `comparePassword(plainPassword, hash)`, ambas `async`
  - `studentService.js` (`/src/services`): responsable de la entidad estudiante. Expone `getStudents()` (fetch de `Students.json`), `findStudentByDni(dni)`, `getRegisteredStudents()` y `saveRegisteredStudent(dni, hash)` (lectura/escritura del registro de contraseñas en `localStorage`, bajo la clave `registeredStudents`, como un objeto `{ dni: hash }`)
  - Listeners de submit en `main.js` para `loginForm` y `registerForm`, con manejo de las siguientes bifurcaciones:
    - **Login:** DNI no encontrado -> error. DNI encontrado pero sin contraseña registrada -> se le avisa al usuario que debe registrarse primero. DNI encontrado y registrado -> se compara la contraseña ingresada contra el hash guardado.
    - **Registro:** DNI no encontrado -> error (el colegio no cargó esa cédula). DNI encontrado pero ya registrado -> error, no se permite re-registrar ni sobrescribir la contraseña existente por este medio. DNI encontrado y sin registrar -> se valida que la contraseña y su confirmación coincidan, se hashea y se guarda.
  - Los formularios no recargan la página gracias a `event.preventDefault()` en cada listener.
- **Sistema de alertas propio:**
  - Modal reutilizable en `index.html` que reemplaza por completo al `alert()` nativo del navegador (no bloquea la ejecución de JS y sí se puede estilizar).
  - Estructura: `#modal-overlay` (fondo oscuro fijo de pantalla completa) que contiene `.modal-card` (tarjeta) con `#modal-message` (texto) y `#modal-ok-button` (botón de confirmación).
  - `showAlert(message, type)` centraliza la lógica: actualiza el texto, agrega la clase del tipo (`error` o `success`) y muestra el modal agregando la clase `active`. Cualquier valor distinto de `'error'` se trata como éxito.
  - Aparición y cierre con fade in/out (`opacity` + `pointer-events` + `transition`).
  - Cada tipo tiene su propio gradiente de fondo (rojizo para error, verdoso para éxito) para que el usuario distinga el resultado de un vistazo. El botón OK es neutro para no chocar con ninguno de los dos fondos.
  - El listener del botón OK se registra una única vez, a nivel general del script (no dentro de `showAlert`), y al cerrar quita las clases `error`, `success` y `active` sin condición, para que no se acumulen entre alertas.
  - Criterio para clasificar los mensajes: es `error` si frena al usuario de lograr su objetivo (DNI inexistente, contraseña incorrecta, campo vacío), y `success` si lo logra.

### Pendiente

- Dashboard de estudiante (`dashboard-estudiante.html`) y manejo de roles
- Definir e incorporar el campo `role` tanto en `Students.json` como en la lógica de registro
- Recolectar y usar el campo `name` del formulario de registro en la lógica (por ahora solo se lee desde `Students.json`)
- Dashboard de profesor (`dashboard-profesor.html`)
- Lógica de bloqueo tras demasiados intentos fallidos de contraseña (el mensaje ya está definido, la lógica de conteo todavía no)
- Deuda técnica menor: validación de campos vacíos también en JS (hoy depende solo del `required` de HTML), y accesibilidad del modal (cerrar con Escape, atrapar el foco del teclado mientras está abierto)
- Revisar consistencia de mayúsculas/minúsculas entre distintos `id` del HTML

## Estructura de carpetas

```
/proyecto-notas
  index.html                    -> login/registro (panel deslizante) + modal de alertas
  dashboard-profesor.html       -> pendiente
  dashboard-estudiante.html     -> pendiente
  /css
    variables.css               -> @import de la fuente y variables en :root
    base.css                    -> reset global, body y botón de tema
    login-register.css          -> contenedor, formularios, inputs y botones submit
    toggle.css                  -> panel deslizante, sus botones, keyframes y reglas de estado
    modal.css                   -> modal de alertas
    dark-mode.css               -> reglas del modo oscuro (se carga al final)
  /images
    (imagen de fondo del campus)
  /src
    /data
      Students.json             -> datos precargados de estudiantes (dni, name)
    /models        -> Usuario, Estudiante, Nota (pendiente)
    /services
      passwordService.js        -> hashing y comparación de contraseñas (bcryptjs)
      studentService.js         -> acceso a Students.json y a localStorage
    /ui            -> funciones que pintan el DOM (pendiente)
    main.js        -> toggle login/register + lógica de autenticación + sistema de alertas
```

La separación en `/src` con `data`, `models`, `services`, `ui` está pensada como el equivalente informal a Clean Architecture en C#: `data` ≈ Infrastructure, `models` ≈ Domain, `services` ≈ Application, `ui` ≈ Presentation.

## Decisiones de diseño relevantes

- **Sin `<form action>`**: los formularios no usan `action` porque no hay backend todavía; el envío se intercepta en JS con `event.preventDefault()`.
- **`box-sizing: border-box` global**: evita que `padding` desborde los anchos definidos en porcentaje.
- **Contenido superpuesto vía `position: absolute`**: `box-login`, `box-register` y `toggle-box` ocupan el mismo espacio dentro de `login-container` (que tiene `position: relative`), y se muestran/ocultan con `opacity` en vez de `display: none`, porque se necesitan animar.
- **Íconos con wrapper propio**: cada input+ícono vive en su propio `.input-wrapper` (en vez de compartir el `position: relative` con el `label`), para que el centrado vertical del ícono (`top: 50%; transform: translateY(-50%)`) sea robusto y no dependa de ajustar números a ojo.
- **DNI en formato string, no number**: aunque el DNI no se usa en operaciones matemáticas, se modela como `string` (tanto en `Students.json` como en la lógica de JS) para mantener consistencia con la propiedad `DNI` de tipo `string` en `Student.cs`, y para evitar comparaciones inconsistentes contra el valor de un `<input>`, que siempre llega como string.
- **Nombres de campos en inglés**: se decidió mantener `dni` y `name` en inglés en todo el código JS y en `Students.json`, en vez de `cedula`/`nombre`, para que el vocabulario del frontend coincida con el del backend en C# a futuro.
- **Hashing de contraseñas en el cliente, solo como práctica**: se usa bcryptjs en el navegador para simular el flujo completo de hash/compare mientras no existe backend. Es una decisión temporal y consciente: el hashing real, en producción, debe ocurrir del lado del servidor; este mock se reemplaza cuando se conecte la API en C#.
- **Servicios separados por responsabilidad**: `passwordService.js` (hashing, infraestructura pura) se mantiene separado de `studentService.js` (entidad estudiante, datos y localStorage) en vez de unificarlos en un único `authService.js`, siguiendo el mismo principio de separación de responsabilidades que se aplica en el backend en C#.
- **Registro no permite sobrescritura**: si un DNI ya tiene una contraseña registrada, el formulario de registro lo rechaza y lo redirige conceptualmente al login, en vez de permitir pisar la contraseña existente sin verificación.
- **Modal HTML fijo, no generado dinámicamente**: el modal vive escrito en `index.html` y se muestra/oculta por clases, en vez de crearse desde JS con `document.createElement(...)` en cada alerta, ya que la estructura es siempre la misma y solo cambia el texto y el tipo. Queda pendiente evaluar la generación dinámica para casos futuros donde el contenido sí varíe de forma más compleja.
- **Fade del modal con `opacity` y no con `display`**: `display` no se puede animar, así que el modal permanece siempre con `display: flex` y se oculta con `opacity: 0` + `pointer-events: none`. Es el mismo enfoque que ya se usaba en el toggle login/register.
- **Un solo `showAlert` con parámetro `type`, en vez de `showError` y `showSuccess`**: la lógica interna es la misma salvo por el color, y agregar un tercer tipo (por ejemplo, advertencia) solo requiere un valor más y su regla CSS.
- **CSS dividido por responsabilidad y variables en `:root`**: el archivo único de más de 400 líneas se limpió (reglas muertas, duplicadas y propiedades repetidas) y luego se partió en seis archivos. Los valores que se repetían se centralizaron en variables, nombradas por su función y no por su apariencia (`--color-accent`, `--gradient-main`). Los dos gradientes casi idénticos que existían se unificaron en uno solo.
- **Orden de los `<link>` de CSS**: `variables.css` va primero (se lee de arriba hacia abajo y la fuente empieza a descargarse antes) y `dark-mode.css` va al final, porque sus reglas deben pisar a las demás. `variables.css` y `base.css` están pensados para reutilizarse tal cual en los dashboards.

## Cómo correrlo

No requiere instalación ni build. Se recomienda usar la extensión Live Server de VS Code (en vez de abrir el archivo directo con doble clic), ya que la lógica de autenticación usa `fetch()` para leer `Students.json`, lo cual requiere que el proyecto se sirva por HTTP y no como archivo local (`file://`).