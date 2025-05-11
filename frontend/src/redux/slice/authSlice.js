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
      console.log(action.payload.user, 'aaa')
      const { user } = action.payload;
      state.user = user;
      console.log(state.user, 'state');
      
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
