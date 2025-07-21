import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const loggingMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔄 ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
  }
  
  const result = next(action);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Next State:', store.getState());
    console.groupEnd();
  }
  
  return result;
};