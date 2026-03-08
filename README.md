# Business Chat Assistant (MVP)

Asistente documental conversacional full-stack en **Next.js + TypeScript** para operar proyectos y documentos en Google Drive/Google Docs desde lenguaje natural.

## Árbol de directorios

```text
.
├── app/
│   ├── api/
│   │   ├── documents/[documentId]/route.ts
│   │   ├── projects/route.ts
│   │   └── projects/[projectId]/
│   │       ├── chat/route.ts
│   │       └── documents/route.ts
│   ├── projects/[id]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
│   ├── actions/
│   ├── ai/
│   ├── db/
│   ├── documents/
│   ├── google/
│   └── projects/
├── prisma/
│   └── schema.prisma
├── scripts/setup.sh
├── templates/
├── types/
└── README.md
```

## Arquitectura resumida

- **UI (Next app router)**: páginas de listado de proyectos y detalle con panel de chat/documentos/actividad.
- **Parser conversacional** (`lib/ai/intent-interpreter.ts`): interpreta mensaje a acción estructurada (`AssistantAction`).
- **Capa de acciones** (`lib/actions/executor.ts`): valida y ejecuta operaciones reales.
- **Integración IA** (`lib/ai/openai.ts`): cliente OpenAI desacoplado.
- **Integración Google** (`lib/google/*`): helpers Drive y Docs.
- **Persistencia** (`prisma/schema.prisma`, `lib/projects/service.ts`): proyectos, documentos, chat y auditoría.
- **Plantillas** (`templates/*.md`): documentos base con headings para edición por sección.

## Qué hace el MVP

- Crear/listar proyectos.
- Crear estructura de carpetas base de proyecto (si hay credenciales Google).
- Crear documentos desde plantilla.
- Listar documentos por proyecto.
- Leer documento.
- Agregar o reemplazar secciones por heading.
- Registrar historial/auditoría.
- Pedir confirmación para acciones destructivas (`delete_doc`) o reemplazos ambiguos.

## Modelo de datos (Prisma)

- `Project`
- `Document`
- `ChatMessage`
- `ActionLog`

## Flujo IA + acciones

1. Usuario envía mensaje.
2. Se persiste en `ChatMessage`.
3. `intent-interpreter` produce `AssistantAction`.
4. `executor` valida y ejecuta.
5. Se guarda `ActionLog`.
6. Se responde al chat con resumen.

## Configuración de entorno

Copiá `.env.example` a `.env` y completá:

```env
DATABASE_URL="file:./prisma/dev.db"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
GOOGLE_SERVICE_ACCOUNT_EMAIL=""
GOOGLE_PRIVATE_KEY=""
GOOGLE_DRIVE_SHARED_ROOT_ID=""
```

### OpenAI

1. Crear API key.
2. Cargarla en `OPENAI_API_KEY`.
3. Opcional: cambiar `OPENAI_MODEL`.

### Google Drive/Docs API

1. Crear proyecto en Google Cloud.
2. Habilitar APIs:
   - Google Drive API
   - Google Docs API
3. Crear service account y key JSON.
4. Copiar email y private key al `.env`.
5. Compartir carpeta raíz de Drive con el service account.
6. Setear `GOOGLE_DRIVE_SHARED_ROOT_ID`.

## Cómo correr localmente

### Setup rápido

```bash
./scripts/setup.sh
npm run dev
```

### Paso a paso

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Abrir: `http://localhost:3000`

## Migraciones

```bash
npm run prisma:migrate
```

## Endpoints principales

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId/documents`
- `GET /api/documents/:documentId`
- `POST /api/projects/:projectId/chat`

## Limitaciones actuales del MVP

- No hay OAuth de usuario final (solo service account/local).
- `rename_doc` quedó marcado como siguiente paso.
- `delete_doc` no ejecuta borrado real sin confirmación explícita/flujo de doble paso.
- UI de preview de documento está expuesta por endpoint JSON (sin viewer rico todavía).

## Siguientes pasos sugeridos

1. Confirmaciones con `pending_actions` y token temporal.
2. OAuth Google por usuario/proyecto.
3. Vista de documento rich text en frontend.
4. Parser híbrido con function calling estricto + validación Zod completa.
5. RBAC y multiusuario real.
6. Tests unitarios de parser y edición por secciones.
