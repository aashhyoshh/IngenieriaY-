# Ingeniería Y

Plataforma editorial en React, Vite y React Router. Diseño adaptable en español, catálogo inicialmente vacío y lector PDF con PDF.js cargado bajo demanda. No contiene revistas publicadas ni una base de datos.

## Desarrollo

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Pantallas

| Ruta                  | Contenido                                                 |
| --------------------- | --------------------------------------------------------- |
| `/`                   | Portada editorial y exploración de disciplinas            |
| `/revistas`           | Biblioteca vacía, búsqueda, filtros y ordenación          |
| `/lector`             | Estado inicial del lector                                 |
| `/lector?borrador=ID` | PDF local de un borrador de la sesión                     |
| `/revistas/:id`       | Entrada preparada para lectura de una futura edición      |
| `/comunidad`          | Comentarios locales, ordenación y eliminación             |
| `/acceso`             | Creación de perfil de demostración                        |
| `/perfil`             | Perfil editable, lecturas guardadas y comentarios propios |
| `/nosotros`           | Proyecto editorial y valores                              |
| `/admin`              | Resumen, borradores, moderación local y vista de usuarios |

## Alcance actual

- No hay autenticación, contraseñas, permisos reales, servidor ni base de datos.
- El panel editorial es una demostración pública; no debe utilizarse como control de acceso.
- Los perfiles y comentarios se guardan en `localStorage`, exclusivamente en el navegador actual. No se sincronizan entre dispositivos.
- Los PDF se seleccionan como archivos locales y se representan mediante URLs `blob:`. No se envían a ningún servidor, no se publican y se pierden al recargar la aplicación.
- El catálogo público permanece vacío incluso al preparar borradores.
- El lector permite paginación limitada al número real de páginas, zoom, fondo claro u oscuro, marcado de sesión, pantalla completa y acceso al PDF original. El original permite búsqueda, descarga y lectura accesible con las herramientas del navegador.
- Fuentes tipográficas servidas desde Google Fonts; se incluyen fuentes de sistema alternativas.

## Próxima conexión del servidor

El estado compartido de `src/main.jsx` reúne perfiles, comentarios y borradores. Sustituir este adaptador local por servicios HTTP cuando se decida el backend. No es necesario cargar contenido para usar la interfaz actual.

Modelo sugerido:

- **Usuario**: id, nombre, correo, biografía, avatar, rol, fecha de registro.
- **Edición**: id, slug, título, descripción, tema, autores, número, portada, URL del PDF, páginas, estado (borrador/publicado), fecha de publicación.
- **Comentario**: id, usuarioId, ediciónId opcional, texto, estado de moderación, fecha.
- **Lectura guardada**: usuarioId, ediciónId, última página, fecha.

Implementar autenticación real y autorización en el servidor antes de permitir cargas o publicaciones persistentes. Restringir publicación y moderación al rol administrador; validar PDF, tamaño y propiedad en el servidor. El estado local no concede permisos.

## Vercel

`vercel.json` configura compilación, directorio `dist` y fallback de rutas SPA. Despliegue desde este directorio:

```sh
vercel link
vercel --prod
```

La instalación de GitHub de Vercel debe tener acceso al repositorio para habilitar despliegues automáticos desde Git. La publicación manual por CLI funciona independientemente de esa integración.
