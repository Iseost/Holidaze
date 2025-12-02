import { Navigate, useLocation } from "react-router-dom";

function useAuth() {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = Boolean(token);
  const isManager = Boolean(user?.venueManager);
  return { isLoggedIn, isManager };
}

export function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function RequireManager({ children }) {
  const { isLoggedIn, isManager } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!isManager) {
    return <Navigate to="/" replace />;
  }
  return children;
}
