import React from 'react';
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

const isAuth = false;
const user = {
  activated: false,
};

const App = () => {
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
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

// GuestRoute component
const GuestRoute = ({ children }) => {
  const location = useLocation();

  return !isAuth ? (
    children
  ) : (
    <Navigate to="/rooms" replace state={{ from: location }} />
  );
};

// Semi Protected Routes
const SemiProtectedRoute = ({ children }) => {
  const location = useLocation();
  return !isAuth ? (
    <Navigate to={'/'} replace state={{ from: location }} />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to={'/rooms'} replace state={{ from: location }} />
  );
};

// Protected Routes
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  return !isAuth ? (
    <Navigate to={'/'} replace state={{ from: location }} />
  ) : isAuth && !user.activated ? (
    <Navigate to={'/active'} replace state={{ from: location }} />
  ) : (
    children
  );
};

export default App;
