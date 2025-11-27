function Cards({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="bg-white p-5 rounded-xl shadow text-center">
        <h3 className="text-gray-500">Usuarios</h3>
        <p className="text-3xl font-bold">{stats.total_usuarios}</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow text-center">
        <h3 className="text-gray-500">Empleados</h3>
        <p className="text-3xl font-bold">{stats.total_empleados}</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow text-center">
        <h3 className="text-gray-500">Libros</h3>
        <p className="text-3xl font-bold">{stats.total_libros}</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow text-center">
        <h3 className="text-gray-500">Préstamos activos</h3>
        <p className="text-3xl font-bold">{stats.prestamos_activos}</p>
      </div>

    </div>
  );
}

export default Cards;
