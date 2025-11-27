import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/registrar", {
        ...form,
        tipo_usuario: "Usuario", // 🔥 El registro siempre será usuario normal
      });

      alert("Cuenta creada correctamente");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Error al registrar");
    }
  };

  return (
    <div className="registro-container">
      <h2>Crear Cuenta</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="dni" placeholder="DNI" onChange={handleChange} required />
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
        <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />

        <button type="submit">Registrarse</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Registro;