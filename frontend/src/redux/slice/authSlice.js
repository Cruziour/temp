import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    hash: '',
    phone: '',
    expires: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload;
      if(!user) {
        state.isAuth = false;
        state.user = null;
      }
      state.user = user;
      state.isAuth = true
    },
    setOtp: (state, action) => {
      const { phone, hash, expires } = action.payload;
      state.otp.phone = phone;
      state.otp.hash = hash;
      state.otp.expires = expires;
    },
  },
});

export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
