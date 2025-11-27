import { useEffect, useState } from "react";
import api from "../../services/api";

function Prestamo() {
  const [prestamos, setPrestamos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api.get(`/prestamos/usuario/${user.id_usuario}`)
      .then(res => setPrestamos(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Mis Préstamos</h2>
      <ul>
        {prestamos.map((p) => (
          <li key={p.id}>{p.nombre_libro}</li>
        ))}
      </ul>
    </div>
  );
}

export default Prestamo;
