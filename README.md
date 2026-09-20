# AppGym A&L

Aplicacion web estatica hecha con React, Vite, Tailwind CSS y lucide-react.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Rutinas

Toda la informacion editable vive en:

```text
src/data/routines.js
```

No usa backend, base de datos, login ni servicios pagos.

## GitHub Pages

El proyecto incluye:

- `vite.config.js` con `base: './'` para funcionar bien en GitHub Pages.
- `.github/workflows/deploy.yml` para publicar el contenido de `dist` desde GitHub Actions.

Para publicar:

1. Sube el proyecto a un repositorio de GitHub.
2. En GitHub, ve a `Settings > Pages`.
3. En `Build and deployment`, selecciona `GitHub Actions`.
4. Haz push a la rama `main`.

## Bloque de Alfonso

- Plan: lunes/miércoles/viernes Full Body, martes running y jueves HYROX.
- Al abrir por primera vez, el bloque empieza el lunes de esa semana (el próximo lunes si es fin de semana). Por defecto dura 4 semanas, con 3 semanas iniciales de running. Ambos valores y la fecha se ajustan en **Ajustar bloque**.
- La semana dura 7 días desde la fecha elegida. El aviso cuenta la semana actual. Al acabar, se pide revisar el bloque; no se reinicia automáticamente.
- El martes pasa automáticamente a semana A (40–45 min continuos) y B (5 × 3 min rápidos + 2 min suaves) tras 2 o 3 semanas iniciales.
- **Ajustar jueves** permite sustituir la sesión de esa semana por texto. Dejarlo vacío recupera la base. El resto de días no cambia.
- Se guardan ciclo, jueves y sesiones completadas en `localStorage`, clave `appgym:alfonso:cycle:v1`. No hay backend ni sincronización entre navegadores. Los avisos son dentro de la app.
- Cambiar la fecha de inicio comienza otro bloque y limpia las marcas y ajustes de jueves. Cambiar solo la duración conserva esos datos.
- Lily conserva sus rutinas, perfil y recomendaciones originales.

Validación: `node --test` y `npm run build`.
