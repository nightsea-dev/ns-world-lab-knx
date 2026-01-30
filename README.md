# NS-WORLD-LAB-KLX

Nx monorepo containing two apps and three workspace packages.

## Repository layout

- apps/
  - admin/  React app (Rspack)
  - board/  React app (Rspack)
- packages/
  - logic/  Runtime logic library (emits JS + types)
  - types/  Types-only library (emit declarations only; import type only)
  - web/    Shared React components, layout, and UI primitives (runtime)

## Core rules (do not break)

- Bundlers (Rspack) do not read TypeScript path aliases.
  Runtime resolution is via node_modules and each package's package.json exports/main.
- packages/types is types-only:
  always `import type { ... } from "@ns-lab-klx/types"`.
  Never require it at runtime.
- packages/logic and packages/web are runtime libraries:
  they must emit JS to dist/ and package.json must point to dist entrypoints.
- Avoid self-imports inside a package:
  do not import "@ns-lab-klx/web" from within packages/web.

## Build and clean

Canonical clean (run from repo root):

- nx reset
- tsc -b tsconfig.build.json --clean

Build order is controlled by TypeScript project references.
Rspack uses package outputs, not source.

## Tailwind CSS

Tailwind is configured once at repo root:

- tailwind.config.mjs
- postcss.config.mjs

Each app imports its own CSS entry in apps/<app>/src/styles/styles.css.
