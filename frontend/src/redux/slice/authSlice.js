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
      state.user = user;
      if (user === null) {
        state.isAuth = false;
      } else {
        state.isAuth = true;
      }
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
