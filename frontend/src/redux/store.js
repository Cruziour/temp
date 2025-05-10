import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice.js';
import activateSlice from './slice/activateSlice.js';

const store = configureStore({
  reducer: {
    authSlice,
    activateSlice,
  },
});

export default store;
