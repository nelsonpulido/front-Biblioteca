import React, { useEffect, useState } from "react";
import axios from "axios";

function Prestamo() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:8000/api/admin/prestamos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPrestamos(res.data.prestamos);
      } catch (error) {
        console.error("Error obteniendo préstamos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  if (loading) return <p>Cargando préstamos...</p>;

  return (
    <div>
      <h2>Lista de Préstamos</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Libro</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
          </tr>
        </thead>

        <tbody>
          {prestamos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.usuario?.name}</td>
              <td>{p.libro?.titulo}</td>
              <td>{p.fecha_prestamo}</td>
              <td>{p.fecha_devolucion ?? "Pendiente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Prestamo;
