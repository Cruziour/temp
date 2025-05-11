import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUserService } from '../../../services';
import { setAuth } from '../../../redux/slice/authSlice';

const Navigation = () => {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.authSlice);
  const logoutUser = async () => {
    try {
      const { data } = await logoutUserService();
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error, 'navigation');
    }
  };

  return (
    <nav className="container min-w-full min-h-[8vh] flex justify-center items-center ">
      <div className="min-w-[90vw] flex justify-between items-center">
        <Link to="/" className="flex items-center gap-x-2">
          <img src="/images/logo.png" alt="" />
          <span className="text-[22px] font-bold">Codershouse</span>
        </Link>
        <div className="flex  justify-center items-center gap-x-4">
          {isAuth && (
            <>
              <div className="border-b-4 rounded-4xl border-amber-500 px-4 py-2">
                <h3 className="text-xl font-bold">{user?.name}</h3>
              </div>
              <Link to={'/'}>
                <img
                  src={user?.avatar}
                  alt="avatar"
                  className="rounded-full w-12 h-12 border-2 border-blue-600"
                />
              </Link>
              <button
                onClick={logoutUser}
                className="cursor-pointer bg-blue-800 hover:bg-blue-600 py-1 px-2 rounded-2xl"
              >
                <img src={`/images/arrow-forward.png`} alt="" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
