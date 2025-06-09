# ADR-002: State Management with MobX

## Date

2025-05-26

## Status

Accepted

## Context

The application requires a robust state management solution to handle:
- Track data CRUD operations
- Search and filtering states
- UI state (modals, loading states, errors)
- Audio playback state
- Pagination state

We needed a solution that would:
- Be easy to implement and maintain
- Provide reactive updates
- Scale well with application growth
- Have good TypeScript support
- Minimize boilerplate code

## Decision

We chose **MobX** (with mobx-react-lite) as our state management solution. The implementation includes:

1. Core Structure:
   ```typescript
   // Single TrackStore for managing all track-related state
   class TrackStore {
     // Observable state
     tracks: Track[]
     loading: boolean
     error: Error | null
     
     // Actions
     fetchTracks()
     createTrack()
     updateTrack()
     deleteTrack()
     
     // Computed values
     get filteredTracks()
   }
   ```

2. Context Integration:
   ```typescript
   // TrackStoreContext for React integration
   const TrackStoreContext = createContext<TrackStore | null>(null);
   
   // Custom hook for easy access
   export const useTrackStore = () => {
     const store = useContext(TrackStoreContext);
     if (!store) {
       throw new Error('useTrackStore must be used within TrackStoreProvider');
     }
     return store;
   };
   ```

## Alternatives Considered

### Redux / Redux Toolkit

Pros:
- Industry standard with wide adoption
- Excellent developer tools
- Predictable state updates
- Large ecosystem

Cons:
- More boilerplate code required
- Steeper learning curve
- Less reactive by default
- More complex setup for async operations

### React Context + useReducer

Pros:
- Built into React
- No additional dependencies
- Simple for small applications

Cons:
- No built-in performance optimizations
- Manual implementation of derived state
- Less suitable for complex state updates
- Limited developer tools

## Consequences

### Positive

1. Development Benefits:
   - Less boilerplate code
   - Intuitive reactive updates
   - Easy integration with React components
   - Good TypeScript support

2. Performance Benefits:
   - Automatic fine-grained updates
   - Built-in memoization
   - Minimal re-renders

3. Maintenance Benefits:
   - Centralized state management
   - Clear action/state separation
   - Easy debugging with MobX DevTools

### Negative

1. Team Considerations:
   - Less common than Redux
   - May require team training
   - Smaller community compared to Redux

2. Technical Limitations:
   - Less predictable update batching
   - Need careful consideration of observable patterns
   - Some edge cases with TypeScript decorators

## Notes

- We use the newer MobX 6 API with makeAutoObservable
- Strict mode is enabled for better predictability
- Decorators are avoided for better TypeScript compatibility
- Actions are explicitly marked for clarity

## References

- [MobX Documentation](https://mobx.js.org/)
- [mobx-react-lite Documentation](https://github.com/mobxjs/mobx-react-lite)
- [ADR-001: Project Overview](./adr-001-project-overview.md) 