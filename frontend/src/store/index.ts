import { configureStore } from '@reduxjs/toolkit';
import packageReducer from './packageSlice';
import { localStorageMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    package: packageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
