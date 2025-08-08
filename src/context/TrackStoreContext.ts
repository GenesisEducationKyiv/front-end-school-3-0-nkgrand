import React from 'react';
import type { TrackStore } from '../stores/TrackStore';

export const TrackStoreContext = React.createContext({} as TrackStore);

export const useTrackStore = () => React.useContext(TrackStoreContext);
