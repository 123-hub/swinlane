import { configureStore } from '@reduxjs/toolkit';
import swimlaneReducer from './swimlaneSlice';

export const store = configureStore({
  reducer: {
    swimlane: swimlaneReducer,
  },
});
