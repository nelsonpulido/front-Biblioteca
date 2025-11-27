import { useEffect, useState } from "react";
import api from "../../services/api";

function Autor() {
  const [autores, setAutores] = useState([]);

  useEffect(() => {
    api.get("/autores").then(res => {
      setAutores(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Autores</h2>

      <ul>
        {autores.map(autor => (
          <li key={autor.id_autor}>
            {autor.nombre} {autor.apellidos}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Autor;