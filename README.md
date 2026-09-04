# School No-Borders

Sistema de inicio de sesión y registro para gestión de notas de estudiantes. Proyecto de práctica enfocado en dominar HTML/CSS/JS vanilla antes de escalar a un backend real con ASP.NET Core, EF Core y SQL Server.

## Idea del proyecto

En lugar de un registro libre, el sistema simula el flujo real de un colegio: la cédula (y en el futuro, el rol y el nombre) ya existen precargados en el sistema, y el usuario "reclama" su cuenta creando su propia contraseña la primera vez que entra — en vez de que el colegio le entregue una clave genérica.

Por ahora, los datos viven en `localStorage` del navegador (formato JSON), sin backend. Es una decisión deliberada: primero se domina la lógica de manipulación de datos y DOM con JS puro, y más adelante el mismo frontend se conecta a una API real.

## Roadmap general (fuera de este repo)

Este proyecto es el punto de partida de un stack más grande que se va a ir armando por etapas:

1. **Actual** — HTML + CSS + JS vanilla, datos en `localStorage`
2. **Siguiente** — ASP.NET Core Web API + EF Core + SQL Server como backend real, JWT para autenticación
3. **Más adelante** — TypeScript / React, Tailwind, Docker, Azure

## Estado actual

### ✅ Hecho

- **Estructura HTML** completa: `login-container` con dos formularios (`box-login`, `box-register`) y un panel deslizante (`toggle-box`), todos superpuestos con `position: absolute` dentro del mismo contenedor.
- **Formularios:**
  - Login: cédula + contraseña
  - Register: nombre + cédula + contraseña + confirmar contraseña (sin selector de rol libre — se decidió que el rol debe venir precargado junto a la cédula, no elegido por el usuario, para evitar que cualquiera se autoasigne como profesor)
- **CSS:**
  - Tarjeta centrada con Flexbox, capas superpuestas controladas por `opacity` + `position: absolute`
  - Inputs modernos con íconos (Font Awesome) centrados vía wrapper (`input-wrapper` con `position: relative`)
  - Panel `toggle-box` con gradiente propio, tipografía diferenciada (Montserrat vía `@import` de Google Fonts) y botones tipo "outline" con `:hover`
  - `:focus` personalizado en los inputs
  - **Efecto glassmorphism** en `login-container` (`background: rgba(...)`, `backdrop-filter: blur()`, borde sutil) sobre una imagen de fondo de campus universitario
  - **Animación de transición** entre Login/Register con `@keyframes` (efecto "ola": el panel se expande al 100% del ancho a mitad de camino y se contrae del lado opuesto), más `transition: opacity` para el fade del texto
- **JavaScript (`main.js`):**
  - Toggle funcional entre modo Login/Register vía `classList.add/remove('active')` en el contenedor
  - Bug resuelto: clics bloqueados por paneles invisibles superpuestos (`pointer-events: none/auto` según el panel activo)
  - Bug resuelto: animación indebida al recargar la página (clase `was-active` para distinguir "primera carga" de "cambio real de estado")

### 🚧 Pendiente

- **Modo oscuro** — toggle con ícono sol/luna, `classList.toggle('dark-mode')`, y redefinición de la paleta de colores
- **Lógica real de login/registro en JS** — validar contraseñas, comparar contra `localStorage`, manejar el "primer acceso"
- **Dashboards** — `dashboard-profesor.html` y `dashboard-estudiante.html`, con vistas distintas según rol
- Revisar consistencia de nombres de `id` entre login y register (ej. `Id-login-number` vs `id-register-number`)

## Estructura de carpetas

```
/proyecto-notas
  index.html                    → login/registro (panel deslizante)
  dashboard-profesor.html       → pendiente
  dashboard-estudiante.html     → pendiente
  /css
    style.css
  /img
    (imagen de fondo del campus)
  /src
    /data          → acceso a localStorage (pendiente de implementar)
    /models        → Usuario, Estudiante, Nota (pendiente)
    /services      → validar login, calcular promedio, etc. (pendiente)
    /ui            → funciones que pintan el DOM (pendiente)
    main.js        → toggle login/register (implementado)
```

La separación en `/src` con `data`, `models`, `services`, `ui` está pensada como el equivalente informal a Clean Architecture en C#: `data` ≈ Infrastructure, `models` ≈ Domain, `services` ≈ Application, `ui` ≈ Presentation.

## Decisiones de diseño relevantes

- **Sin `<form action>`**: los formularios no usan `action` porque no hay backend todavía; el envío se intercepta en JS con `event.preventDefault()`.
- **`box-sizing: border-box` global**: evita que `padding` desborde los anchos definidos en porcentaje.
- **Contenido superpuesto vía `position: absolute`**: `box-login`, `box-register` y `toggle-box` ocupan el mismo espacio dentro de `login-container` (que tiene `position: relative`), y se muestran/ocultan con `opacity` en vez de `display: none`, porque se necesitan animar.
- **Íconos con wrapper propio**: cada input+ícono vive en su propio `.input-wrapper` (en vez de compartir el `position: relative` con el `label`), para que el centrado vertical del ícono (`top: 50%; transform: translateY(-50%)`) sea robusto y no dependa de ajustar números a ojo.

## Cómo correrlo

No requiere instalación ni build. Basta con abrir `index.html` en el navegador (recomendado usar la extensión Live Server de VS Code para recarga automática al guardar cambios).