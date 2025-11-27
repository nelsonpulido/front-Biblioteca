import React, { useEffect, useState } from "react";
import { getStatistics, getRecentActivity, getPopularBooks, getReports } from "../../services/dashboardService";
import Cards from "./Cards";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const s = await getStatistics();
      const r = await getRecentActivity();
      const pb = await getPopularBooks();
      const rep = await getReports();

      setStats(s);
      setRecent(r);
      setPopularBooks(pb);
      setReports(rep);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  if (!stats) {
    return <p className="text-center mt-10 text-gray-600">Cargando dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-8">

      {/* 📌 TARJETAS DE ESTADÍSTICAS */}
      <Cards stats={stats} />

      {/* 📊 LIBROS MÁS PRESTADOS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Libros más prestados</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={popularBooks}>
            <XAxis dataKey="libro.titulo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🕒 ACTIVIDAD RECIENTE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>

        {recent.map((item, i) => (
          <div key={i} className="border-b py-2">
            <p><strong>{item.usuario?.nombre}</strong> pidió <strong>{item.libro?.titulo}</strong></p>
            <p className="text-gray-500 text-sm">{item.created_at}</p>
          </div>
        ))}
      </div>

      {/* 📑 REPORTES */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Reportes del mes</h2>
        
        <ul className="space-y-2">
          <li>Préstamos del mes: {reports.prestamos_mes}</li>
          <li>Usuarios activos: {reports.usuarios_activos}</li>
          <li>Libros disponibles: {reports.libros_disponibles}</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
