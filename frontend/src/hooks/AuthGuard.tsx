import { useEffect, useState, } from "react";
import { Navigate } from "react-router-dom";
export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/me", {
      credentials: "include"
    })
      .then(res => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
