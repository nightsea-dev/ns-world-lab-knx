# @ns-lab-klx/logic

Runtime logic library.

## Purpose

- Domain and graph logic
- State and factories used by apps and by @ns-lab-klx/web

## Build output

- Emits JavaScript and declaration files to dist/
- package.json must point runtime entrypoints to dist/*.js

## Import rules

- May import types from @ns-lab-klx/types using import type only.
- Must not depend on React or DOM APIs.
