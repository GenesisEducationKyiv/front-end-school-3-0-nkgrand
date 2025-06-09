import * as React from 'react';
import { TrackStore } from '../stores/TrackStore';
import { TrackStoreContext } from '../context/TrackStoreContext';

export const TrackStoreProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const store = React.useMemo(() => new TrackStore(), []);

  return (
    <TrackStoreContext.Provider value={store}>
      {children}
    </TrackStoreContext.Provider>
  );
};
