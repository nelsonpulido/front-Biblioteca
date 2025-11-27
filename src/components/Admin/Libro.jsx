import React, { useEffect, useState } from "react";
import axios from "axios";

function Libro() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:8000/api/admin/libros", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLibros(res.data.libros);
      } catch (error) {
        console.error("Error obteniendo libros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  if (loading) return <p>Cargando libros...</p>;

  return (
    <div>
      <h2>Lista de Libros</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Género</th>
            <th>Disponibilidad</th>
          </tr>
        </thead>

        <tbody>
          {libros.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.titulo}</td>
              <td>{l.autor}</td>
              <td>{l.genero}</td>
              <td>{l.disponible ? "Disponible" : "No disponible"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Libro;