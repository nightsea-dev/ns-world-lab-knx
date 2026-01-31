# NS-WORLD-LAB-KLX

Nx-based monorepo containing frontend applications and shared libraries
for spatial graph / board-style UI experimentation.

This repository separates **runtime logic**, **type contracts**, and **UI components**
into explicit workspace packages, consumed by one or more apps.



## Repository layout

```
apps/
  main-app/        Primary React application (Vite)
packages/
  logic/           Runtime logic (graph state, factories, utils)
  types/           Types-only package (contracts, composites, primitives)
  web/             Shared React UI components and hooks
```


## Design rules (important)

### 1. Types vs runtime are strictly separated

- `@ns-lab-klx/types`
  - Types only
  - Emits declarations only
  - Must always be imported using `import type`
  - Never used at runtime

- `@ns-lab-klx/logic`
  - Runtime library
  - Emits JavaScript + types
  - Contains graph state, factories, utilities

- `@ns-lab-klx/web`
  - Runtime React components and hooks
  - Depends on `logic` and `types`


### 2. No TS path aliases at runtime

Bundlers (Rspack / Vite) do **not** resolve TypeScript path aliases.

All runtime resolution must go through:
- `node_modules`
- `package.json` `exports` / `main` fields
- compiled output in `dist/`

Never rely on TS-only path mapping for runtime imports.


### 3. No self-imports inside a package

Inside a package:
- ❌ `import { X } from "@ns-lab-klx/web"` (from within `packages/web`)
- ✅ relative imports only

Each package must be buildable in isolation.


## Build and clean

Canonical clean (from repo root):

```bash
nx reset
tsc -b tsconfig.build.json --clean
```

Build order is handled via TypeScript project references.
Applications consume **built package outputs**, not source files.


## Styling (Tailwind CSS)

Tailwind is configured once at the repo root:

- `tailwind.config.mjs`
- `postcss.config.mjs`

Each app imports its own CSS entry file, for example:

```
apps/main-app/src/styles/styles.css
```


## Dependency graphs

#### apps/
* [main-app](./docs/main-app.svg)

#### packages/
* [types](./docs/types.svg)
* [logic](./docs/logic.svg)
* [web](./docs/web.svg)






## Status

This repository is under active development and serves as an
experimental foundation for spatial UI and graph-based interaction models.

## License
MIT
