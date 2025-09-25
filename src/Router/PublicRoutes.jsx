import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoutes = ({ isAuthenticated, redirectTo }) => {
  const location = useLocation();

  // If user is authenticated and trying to access auth pages (login, signup, etc.), redirect them
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/signup") ||
      location.pathname.includes("/forget") ||
      location.pathname.includes("/registration"))
  ) {
    return <Navigate to={redirectTo} />;
  }

  // Otherwise, allow access (dashboard)
  return <Outlet />;
};

export default PublicRoutes;
