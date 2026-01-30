# board app

React app focused on the board surface and node rendering, built with Rspack.

## Entry points

- src/main.tsx
- src/index.html
- src/index-board.ts
- src/styles/styles.css

## Run

From repo root:

- nx serve board

## Notes

- Keep scrolling and layout concerns inside layout primitives rather than inside feature components.
- Use @ns-lab-klx/logic for runtime state/graph logic and @ns-lab-klx/types for type contracts (import type only).
