import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const offlineMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const isOnline = navigator.onLine;
  
  if (!isOnline && action.type.endsWith('/pending')) {
    // Queue offline actions for later sync
    const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    offlineActions.push({
      action,
      timestamp: Date.now(),
    });
    localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
  }
  
  return next(action);
};