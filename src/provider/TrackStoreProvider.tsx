import React from 'react';
import { TrackStore } from '../stores/TrackStore';
import { TrackStoreContext } from '../context/TrackStoreContext';
import type { PropsWithChildren } from 'react';

export const TrackStoreProvider = ({ children }: PropsWithChildren) => {
  const store = React.useMemo(() => new TrackStore(), []);

  return (
    <TrackStoreContext.Provider value={store}>
      {children}
    </TrackStoreContext.Provider>
  );
};
