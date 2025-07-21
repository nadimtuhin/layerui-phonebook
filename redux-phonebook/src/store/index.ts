import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import contactsReducer from './slices/contactsSlice';
import searchReducer from './slices/searchSlice';
import uiReducer from './slices/uiSlice';
import groupsReducer from './slices/groupsSlice';
import { offlineMiddleware } from './middleware/offlineMiddleware';
import { loggingMiddleware } from './middleware/loggingMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['search', 'ui'], // Don't persist search and UI state
};

const rootReducer = combineReducers({
  contacts: contactsReducer,
  groups: groupsReducer,
  search: searchReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(offlineMiddleware)
    .concat(loggingMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;