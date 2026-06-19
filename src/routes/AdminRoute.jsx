import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/entrar" />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    if (payload.role !== "ROLE_ADMIN") {
      return <Navigate to="/acompanhamento" />; 
    }
  } catch (error) {
    console.error("Token inválido", error);
    return <Navigate to="/entrar" />;
  }

  return children;
}

export default AdminRoute;