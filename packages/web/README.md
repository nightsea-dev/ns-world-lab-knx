# @ns-lab-klx/web

Shared React components and UI/layout primitives.

## Purpose

- Layout primitives: Header, Footer, Main, Page
- UI primitives: buttons, close button, small widgets
- Graph-related React components and hooks

## Build output

- Emits JavaScript and declaration files to dist/
- package.json must point runtime entrypoints to dist/*.js

## Import rules

- May import runtime logic from @ns-lab-klx/logic.
- May import contracts from @ns-lab-klx/types using import type only.
- Avoid self-imports inside this package (no "@ns-lab-klx/web" imports within packages/web).

## Tailwind

Components use Tailwind utility classes.
Tailwind compilation is handled by the root PostCSS/Tailwind configuration.
