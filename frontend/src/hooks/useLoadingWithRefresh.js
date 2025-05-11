import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slice/authSlice';

export function useLoadingWithRefresh() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/refresh-token`,
          {
            withCredentials: true,
          }
        );
        const user = data?.data?.user;

        if (user) {
          dispatch(setAuth({ user })); // ✅ Only send expected shape
        } else {
          console.warn('No user data found in refresh-token response.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error refreshing token:', error);
        setLoading(false);
      }
    })();
  }, [dispatch]);
  return { loading };
}
