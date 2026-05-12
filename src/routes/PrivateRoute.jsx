import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/entrar" />;
  }

  return children;
}

export default PrivateRoute;