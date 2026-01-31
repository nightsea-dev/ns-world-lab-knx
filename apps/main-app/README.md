# main-app

Primary React application for the NS-WORLD-LAB-KLX workspace.

This app integrates the shared graph logic and UI components to render
interactive board-style surfaces and related admin features.

---

## Entry points

- `src/main.tsx` — main React entry
- `index.html`
- `src/index-board.ts` — board-specific bootstrap
- `src/styles/styles.css` — Tailwind + app styles

---

## Feature structure

```
src/features/
  board-surface/    Spatial board and node surface
  main-app/         App shell and routing
  user-admin/       User administration views
  _types/           Feature-local types
```

Reusable UI is kept under:

```
src/components/
```

---

## Running the app

From the repository root:

```bash
nx serve main-app
```

---

## Architectural notes

- Layout and scrolling concerns belong to layout primitives
  (not feature components).
- Runtime logic must come from `@ns-lab-klx/logic`.
- Type contracts must come from `@ns-lab-klx/types` (type-only imports).
- Shared UI components come from `@ns-lab-klx/web`.

---

## Build output

Production output is emitted to:

```
apps/main-app/dist/
```

The app consumes **built workspace packages**, not source code.
