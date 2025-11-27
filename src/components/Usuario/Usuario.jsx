import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function Usuario() {
  return (
    <div className="usuario">
      <h1>Bienvenido Usuario</h1>

      <nav className="usuario-menu">
        <Link to="/usuario/catalogo">📚 Ver Catálogo</Link>
        <Link to="/usuario/autores">✍ Autores</Link>
        <Link to="/usuario/categorias">🏷 Categorías</Link>
        <Link to="/usuario/prestamos">📘 Mis Préstamos</Link>
      </nav>
    </div>
  );
}

export default Usuario;