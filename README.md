# Underlayer SDK TypeScript
SDK oficial de Underlayer para TypeScript/JavaScript, generado desde OpenAPI.
## Requisitos
- Node.js 18+
- npm 9+
## Instalar dependencias
```bash
npm install
```
## Generar tipos desde OpenAPI
Por defecto lee el spec en `../core/spec/openapi.v1.json`.
```bash
npm run generate
```
Si necesitas otro spec:
```bash
OPENAPI_SPEC_PATH=./ruta/a/openapi.json npm run generate
```
## Build
```bash
npm run build
```
## Test
```bash
npm test
```
## Uso rapido
```ts
import { createUnderlayerClient } from "@underlayer/sdk";
const client = createUnderlayerClient({
  baseUrl: "https://api.underlayer.dev",
  apiKey: "ul_live_xxx",
});
const result = await client.GET("/api/v1/scheduler/tasks", {
  params: { query: { page: 1, page_size: 20 } },
});
```
## Smoke local
```bash
UNDERLAYER_BASE_URL=http://localhost:5111 \\
UNDERLAYER_API_KEY=ul_test_xxx \\
npm run example:smoke
```
## Publicacion npm (cuando toque)
```bash
npm version patch
npm publish --access public
```
## CI/CD automatizado
- `/.github/workflows/ci.yml`: install + build + test + `npm pack --dry-run`.
- `/.github/workflows/release-from-core.yml`: se dispara por `repository_dispatch` desde `core`, descarga el spec del commit indicado, sincroniza version y publica en npm.
### Secrets requeridos en el repo SDK
- `CORE_REPO_READ_TOKEN`: PAT con scope `repo` para leer `underlayer/core`.
- `NPM_TOKEN`: token de npm para publicar `@underlayer/sdk`.
Hasta que no publiques la primera version, `npm install @underlayer/sdk` no estara disponible.
