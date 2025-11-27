import React, { useEffect, useState } from "react";
import axios from "axios";

function Empleados() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const resp = await axios.get("http://localhost:8000/api/empleados");
      setEmpleados(resp.data);
    } catch (error) {
      console.error("Error cargando empleados:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Empleados</h1>

      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Empleados;