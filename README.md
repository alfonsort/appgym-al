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
