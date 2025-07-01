# ADR-007: How MobX Solves State Management Pitfalls in This Project

## Context

This document explains how MobX, as used in this project, addresses common state management pitfalls in React applications. The analysis is based on the current implementation and covers the following typical problems:

1. Prop Drilling Hell
2. useState Spaghetti
3. State Synchronization Nightmare
4. useEffect Dependency Hell
5. Performance Death by a Thousand Cuts
6. Server State Chaos
7. Offline/Online State Amnesia

---

## 1. Prop Drilling Hell
**Problem:** Passing props through many component layers, making code hard to maintain.

**How MobX solves it here:**
- The main state (`TrackStore`) is provided via React Context (`TrackStoreContext`) and accessed with a custom hook (`useTrackStore`).
- Components at any level can access and mutate global state directly, without prop chains.
- Example:
  ```tsx
  // client/src/context/TrackStoreContext.ts
  export const TrackStoreContext = React.createContext({} as TrackStore);
  export const useTrackStore = () => React.useContext(TrackStoreContext);
  ```
  ```tsx
  // Usage in any component
  const trackStore = useTrackStore();
  ```
- This eliminates the need for prop drilling for all track-related state and actions.

---

## 2. useState Spaghetti
**Problem:** Scattered useState hooks across many components, making state hard to reason about.

**How MobX solves it here:**
- Most business logic and server state are centralized in `TrackStore`.
- Local `useState` is used only for UI-specific state (e.g., modal visibility, form input), not for shared or business-critical data.
- Example:
  ```tsx
  // client/src/components/pages/Tracks.tsx
  const trackStore = useTrackStore(); // global state
  const [isModalVisible, setIsModalVisible] = useState(false); // local UI state
  ```
- This separation keeps global state organized and avoids "spaghetti".

---

## 3. State Synchronization Nightmare
**Problem:** Multiple sources of truth (local, global, URL, server) get out of sync.

**How MobX solves it here:**
- All track and genre data, pagination, and loading state are managed in a single MobX store.
- URL parameters are synchronized with store state via controlled effects.
- Example:
  ```tsx
  // client/src/components/pages/Tracks.tsx
  useEffect(() => {
    setSearchParams(...); // syncs search/page with URL
  }, [debouncedValue, trackStore.page]);
  ```
- MobX ensures that any change to observable state is immediately reflected in all observers.

---

## 4. useEffect Dependency Hell
**Problem:** Complex useEffect chains and dependency arrays causing bugs and unnecessary renders.

**How MobX solves it here:**
- MobX observers automatically re-render only when relevant observable state changes, reducing the need for useEffect.
- useEffect is used mainly for side effects (e.g., syncing URL, debouncing input), not for state propagation.
- Example:
  ```tsx
  // Most data flows are handled by MobX reactivity, not useEffect chains.
  ```
- This minimizes the risk of dependency hell.

---

## 5. Performance Death by a Thousand Cuts
**Problem:** Many small inefficiencies (unnecessary renders, expensive computations) degrade performance.

**How MobX solves it here:**
- MobX provides fine-grained reactivity: only components that use changed state re-render.
- `observer` from `mobx-react-lite` wraps components for optimal updates.
- useMemo/useCallback are used for expensive computations and handlers.
- Example:
  ```tsx
  // client/src/components/pages/TracksTable.tsx
  export const TracksTable = observer((props: TracksTableProps) => { ... });
  ```
- This approach keeps the UI fast and responsive.

---

## 6. Server State Chaos
**Problem:** Server data is fetched, cached, and mutated in an ad-hoc way, leading to bugs and duplication.

**How MobX solves it here:**
- All server interactions (fetch, add, update, delete tracks/genres) are encapsulated in `TrackStore` methods.
- State is updated via MobX actions, ensuring consistency and single source of truth.
- Example:
  ```ts
  // client/src/stores/TrackStore.ts
  async fetchTracks(page = this.page): Promise<void> { ... }
  async addTrack(track: Track): Promise<Result<Track, Error>> { ... }
  ```
- This prevents chaos and makes server state predictable.

---

## 7. Offline/Online State Amnesia
**Problem:** App loses or mishandles state when going offline/online.

**Current status:**
- The current implementation does not handle offline/online state explicitly.
- If offline support is required, MobX can be extended with listeners for `window.ononline`/`window.onoffline` and local storage caching.
- For now, this is not a requirement for the project.

---

## Conclusion

MobX, as implemented in this project, effectively solves most common state management pitfalls in React apps:
- Centralizes business and server state
- Eliminates prop drilling and state spaghetti
- Reduces useEffect complexity
- Optimizes performance
- Provides a single source of truth for server data

If offline/online support becomes a requirement, MobX can be extended to handle it as well.

---

**See also:**
- [ADR-002: State Management with MobX](./adr-002-state-management.md)
