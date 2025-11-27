import { useEffect, useState } from "react";
import api from "../../services/api";

function Categoria() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    api.get("/categorias").then(res => {
      setCategorias(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Categorías</h2>

      <ul>
        {categorias.map(cat => (
          <li key={cat.id_categoria}>{cat.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Categoria;