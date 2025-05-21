import * as React from 'react';
import { TrackStore } from '../stores/TrackStore';

export const TrackStoreContext = React.createContext({} as TrackStore);

export const useTrackStore = () => React.useContext(TrackStoreContext);