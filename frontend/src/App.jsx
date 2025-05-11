import React from 'react';
import { useSelector } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Layout from './Layout';
import { Activate, Authenticate, Home, Rooms } from './pages/index';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

const App = () => {
  const { loading } = useLoadingWithRefresh();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />
        <Route
          path="active"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />
        <Route
          path="rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    )
  );

  return (
    <>
      {loading ? (
        <Loader message={'Loading Please wait.'} />
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
};

// Guest Routes
const GuestRoute = ({ children }) => {
  const location = useLocation();
  const { isAuth } = useSelector((state) => state.authSlice);
  return !isAuth ? (
    children
  ) : (
    <Navigate to="/rooms" replace state={{ from: location }} />
  );
};

// Semi Protected Routes
const SemiProtectedRoute = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.authSlice);
  const location = useLocation();
  return !isAuth ? (
    <Navigate to={'/'} replace state={{ from: location }} />
  ) : isAuth && !user?.activated ? (
    children
  ) : (
    <Navigate to={'/rooms'} replace state={{ from: location }} />
  );
};

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.authSlice);
  const location = useLocation();
  return !isAuth ? (
    <Navigate to={'/'} replace state={{ from: location }} />
  ) : isAuth && !user?.activated ? (
    <Navigate to={'/active'} replace state={{ from: location }} />
  ) : (
    children
  );
};

export default App;
