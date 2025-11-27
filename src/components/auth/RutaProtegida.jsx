import { Navigate } from "react-router-dom";

function RutaProtegida({ children, role }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.tipo_usuario !== role) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RutaProtegida;
