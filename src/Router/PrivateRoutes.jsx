import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ isAuthenticated, redirectTo }) => {
  // If not authenticated, redirect to login or specified route
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Otherwise render the nested private routes
  return <Outlet />;
};

export default PrivateRoutes;
