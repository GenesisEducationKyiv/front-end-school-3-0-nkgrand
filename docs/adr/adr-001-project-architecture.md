# ADR-001: React Project Architecture with MobX, Ant Design, and Vite

## Date
2025-05-26

## Context

This project is an SPA for managing audio tracks. It started from a blank template (`vite + react-ts`) without any predefined architecture. The initial requirements included:
- displaying a list of tracks with search, filtering, and pagination;
- creating, editing, and deleting tracks;
- uploading and removing audio files;
- audio playback;
- a user-friendly interface;
- readiness for e2e testing.

The goal was to ensure both **code maintainability** and **user usability** from the beginning.

## Decision

The following decisions were made:

- **React 19 + TypeScript** as the base UI stack.
- **MobX + mobx-react-lite** for state management:
  - Simpler, reactive, and with less boilerplate compared to Redux.
  - A single `TrackStore` handles all track-related actions.
- **Ant Design (v5.24.7)** as the component library:
  - Tables, modals, selects, checkboxes, spinners, icons.
  - Easy customization and rapid UI development.
- **Wavesurfer.js** for audio waveform playback.
- **React Router DOM v7** for SPA routing (prepared for multi-page support).
- **Vite** as the build tool:
  - Instant dev server and HMR.
  - Simple config and fast builds.
- **ESLint + TypeScript ESLint + Prettier** for code quality.
- **Jest + ts-jest** for unit testing.
- **`data-testid` attributes** for e2e test coverage (e.g., Playwright / Cypress in the future).
- **Lodash** for search debounce and utility functions.

## Code Structure

The project is structured by functional domains:

- `src/api/` — API wrappers (`trackApi.ts`)
- `src/assets/` — static assets, SVGs
- `src/components/` — shared UI components (e.g., `Header`)
- `src/pages/` — main application views:
  - `Tracks.tsx` — main page with track list
  - `TracksTable.tsx` — table component
  - `Albums.tsx`, `Artists.tsx`, `Genres.tsx`, `Settings.tsx` — other pages
- `src/context/` — MobX context (`TrackStoreContext.ts`)
- `src/provider/` — context provider (`TrackStoreProvider.tsx`)
- `src/stores/` — MobX store (`TrackStore.ts`)
- `src/types/` — track type definitions (`trackTypes.ts`)
- `__tests__/` — test files
- `main.tsx` — application entry point
- `App.tsx` — layout and routing
- `vite.config.ts`, `jest.config.js`, `eslint.config.js` — project configuration files

This structure allows for fast navigation, clearly separates responsibilities, and supports future scalability.

## Consequences

### ✅ Positive
- **Fast development startup** thanks to component libraries and simple tooling.
- **Readable and modular code** — clear separation of concerns and easy decomposition.
- **Reactive state model** with MobX — automatic UI updates with minimal code.
- **High development productivity** with Vite and Ant Design.
- **Easy test coverage** via `data-testid` attributes.

### ⚠️ Potential drawbacks
- **MobX is less common** than Redux — may require onboarding effort for new developers.
- **Ant Design has a large bundle size** — might need production optimization.
- **Wavesurfer.js lacks strong typings** — some areas required custom type definitions.
- **Jest is not suitable for e2e** — separate setup needed (e.g., Playwright).
- **Filtering and search are handled client-side** — may require backend logic in the future as data grows.