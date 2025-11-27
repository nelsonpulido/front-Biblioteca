import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../services/style/admin.css";

// Importar servicios
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../services/employeeService";
import { getBooks, createBook, updateBook, deleteBook } from "../../services/bookService";
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from "../../services/authorService";
import { getEditorials, createEditorial, updateEditorial, deleteEditorial } from "../../services/editorialService";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import { getLoans, createLoan, updateLoan, deleteLoan } from "../../services/loanService";
import { getStatistics, getReports } from "../../services/reportService";

function Admin() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("inicio");
  const [activeSubView, setActiveSubView] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para datos
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  
  const [statistics, setStatistics] = useState({
    activeUsers: 0,
    borrowedBooks: 0,
    pendingAlerts: 0,
    totalBooks: 0,
    totalAuthors: 0
  });
  
  const [reports, setReports] = useState([]);

  // Estados para formularios
  const [formData, setFormData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    loadStatistics();
  }, []);

  // Cargar datos según vista activa
  useEffect(() => {
    if (activeView === "gestion") {
      if (activeSubView === "usuarios") loadUsers();
      else if (activeSubView === "empleados") loadEmployees();
      else if (activeSubView === "libros") loadBooks();
      else if (activeSubView === "autores") loadAuthors();
      else if (activeSubView === "editoriales") loadEditorials();
      else if (activeSubView === "categorias") loadCategories();
    } else if (activeView === "prestamos") {
      loadLoans();
    } else if (activeView === "reportes") {
      loadReports();
    }
  }, [activeView, activeSubView]);

  // Funciones de carga de datos
  const loadStatistics = async () => {
    try {
      const stats = await getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      const mappedUsers = data.map(u => ({
        id: u.id_usuario || u.id,
        nombre: u.nombre,
        apellidos: u.apellidos,
        email: u.email,
        tipo_usuario: u.tipo_usuario,
        rol: u.tipo_usuario,
        estado: u.activo,
        telefono: u.telefono,
        direccion: u.direccion,
        dni: u.dni
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando empleados...');
      const data = await getEmployees();
      console.log('✅ Empleados cargados:', data);
      
      // Mapear datos para asegurar consistencia
      const mappedEmployees = Array.isArray(data) ? data.map(e => ({
        id: e.id_empleado || e.id,
        id_empleado: e.id_empleado || e.id,
        nombre: e.nombre,
        apellidos: e.apellidos,
        email: e.email,
        cargo: e.cargo,
        estado: e.estado || e.activo,
        telefono: e.telefono,
        dni: e.dni
      })) : [];
      
      setEmployees(mappedEmployees);
    } catch (error) {
      console.error("❌ Error al cargar empleados:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando libros...');
      const data = await getBooks();
      console.log('✅ Libros cargados:', data);
      
      const mappedBooks = Array.isArray(data) ? data.map(b => ({
        id: b.id_libro || b.id,
        id_libro: b.id_libro || b.id,
        titulo: b.titulo,
        isbn: b.isbn,
        categoria_id: b.categoria_id,
        editorial_id: b.editorial_id,
        disponibilidad: b.disponibilidad,
        cantidad: b.cantidad,
        año_publicacion: b.año_publicacion
      })) : [];
      
      setBooks(mappedBooks);
    } catch (error) {
      console.error("❌ Error al cargar libros:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando autores...');
      const data = await getAuthors();
      console.log('✅ Autores cargados:', data);
      
      const mappedAuthors = Array.isArray(data) ? data.map(a => ({
        id: a.id_autor || a.id,
        id_autor: a.id_autor || a.id,
        nombre: a.nombre,
        apellidos: a.apellidos,
        nacionalidad: a.nacionalidad,
        estado: a.estado || a.activo
      })) : [];
      
      setAuthors(mappedAuthors);
    } catch (error) {
      console.error("❌ Error al cargar autores:", error);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEditorials = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando editoriales...');
      const data = await getEditorials();
      console.log('✅ Editoriales cargadas:', data);
      
      const mappedEditorials = Array.isArray(data) ? data.map(e => ({
        id: e.id_editorial || e.id,
        id_editorial: e.id_editorial || e.id,
        nombre: e.nombre,
        pais: e.pais,
        estado: e.estado || e.activo
      })) : [];
      
      setEditorials(mappedEditorials);
    } catch (error) {
      console.error("❌ Error al cargar editoriales:", error);
      setEditorials([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando categorías...');
      const data = await getCategories();
      console.log('✅ Categorías cargadas:', data);
      
      const mappedCategories = Array.isArray(data) ? data.map(c => ({
        id: c.id_categoria || c.id,
        id_categoria: c.id_categoria || c.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        estado: c.estado || c.activo
      })) : [];
      
      setCategories(mappedCategories);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLoans = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando préstamos...');
      const data = await getLoans();
      console.log('✅ Préstamos cargados:', data);
      
      const mappedLoans = Array.isArray(data) ? data.map(p => ({
        id: p.id_prestamo || p.id,
        id_prestamo: p.id_prestamo || p.id,
        usuario_id: p.usuario_id,
        libro_id: p.libro_id,
        fecha_prestamo: p.fecha_prestamo,
        fecha_devolucion: p.fecha_devolucion,
        estado: p.estado
      })) : [];
      
      setLoans(mappedLoans);
    } catch (error) {
      console.error("❌ Error al cargar préstamos:", error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleMenuClick = (view, subView = "") => {
    setActiveView(view);
    setActiveSubView(subView);
    setEditingItem(null);
    setFormData({});
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Menú principal
  const menuItems = [
    { id: "inicio", label: "Inicio", icon: "🏠" },
    { 
      id: "gestion", 
      label: "Gestión de Datos", 
      icon: "📊",
      submenu: [
        { id: "usuarios", label: "Usuarios", icon: "👥" },
        { id: "empleados", label: "Empleados", icon: "👨‍💼" },
        { id: "libros", label: "Libros", icon: "📚" },
        { id: "autores", label: "Autores", icon: "✍️" },
        { id: "editoriales", label: "Editoriales", icon: "🏢" },
        { id: "categorias", label: "Categorías", icon: "📂" }
      ]
    },
    { id: "prestamos", label: "Préstamos", icon: "📖" },
    { id: "reportes", label: "Reportes", icon: "📈" },
    { id: "configuracion", label: "Configuración", icon: "⚙️" }
  ];

  const statsCards = [
    { 
      id: 1, 
      title: "Usuarios Activos", 
      value: statistics.activeUsers || 0, 
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      icon: "👥"
    },
    { 
      id: 2, 
      title: "Libros Prestados", 
      value: statistics.borrowedBooks || 0, 
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      icon: "📚"
    },
    { 
      id: 3, 
      title: "Alertas Pendientes", 
      value: statistics.pendingAlerts || 0, 
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      icon: "⚠️"
    },
    { 
      id: 4, 
      title: "Total Libros", 
      value: statistics.totalBooks || 0, 
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      icon: "📖"
    }
  ];

  const renderContent = () => {
    if (activeView === "inicio") {
      return (
        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h2>Panel de Control de Administración</h2>
              <p>Gestiona todos los recursos de la biblioteca</p>
            </div>
          </div>

          <div className="stats-grid">
            {statsCards.map((card) => (
              <div 
                key={card.id} 
                className="stat-card"
                style={{ background: card.gradient }}
              >
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-content">
                  <h3>{card.title}</h3>
                  <p className="stat-value">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <h3>Acceso Rápido</h3>
            <div className="action-buttons">
              <button onClick={() => handleMenuClick("gestion", "usuarios")} className="action-btn">
                <span>👥</span>
                <span>Gestionar Usuarios</span>
              </button>
              <button onClick={() => handleMenuClick("gestion", "empleados")} className="action-btn">
                <span>👨‍💼</span>
                <span>Gestionar Empleados</span>
              </button>
              <button onClick={() => handleMenuClick("gestion", "libros")} className="action-btn">
                <span>📚</span>
                <span>Gestionar Libros</span>
              </button>
              <button onClick={() => handleMenuClick("prestamos")} className="action-btn">
                <span>📖</span>
                <span>Ver Préstamos</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === "gestion") {
      return (
        <div className="gestion-content">
          <div className="content-header">
            <h2>📊 Gestión de Datos</h2>
          </div>

          <div className="submenu-tabs">
            {menuItems.find(m => m.id === "gestion").submenu.map(sub => (
              <button
                key={sub.id}
                className={`tab-btn ${activeSubView === sub.id ? "active" : ""}`}
                onClick={() => setActiveSubView(sub.id)}
              >
                <span>{sub.icon}</span>
                <span>{sub.label}</span>
              </button>
            ))}
          </div>

          {activeSubView === "usuarios" && renderUserManagement()}
          {activeSubView === "empleados" && renderEmployeeManagement()}
          {activeSubView === "libros" && renderBookManagement()}
          {activeSubView === "autores" && renderAuthorManagement()}
          {activeSubView === "editoriales" && renderEditorialManagement()}
          {activeSubView === "categorias" && renderCategoryManagement()}
        </div>
      );
    }

    if (activeView === "prestamos") {
      return renderLoanManagement();
    }

    if (activeView === "reportes") {
      return renderReports();
    }

    if (activeView === "configuracion") {
      return renderConfiguration();
    }

    return null;
  };

  // Renderizar gestión de usuarios
  const renderUserManagement = () => {
    const filteredUsers = users.filter(u => 
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>👥 Usuarios Registrados ({filteredUsers.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td><span className="badge">{u.id}</span></td>
                      <td>{u.nombre} {u.apellidos}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.tipo_usuario}`}>
                          {u.tipo_usuario}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.estado === 1 ? 'active' : 'inactive'}`}>
                          {u.estado === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar gestión de empleados
  const renderEmployeeManagement = () => {
    const filteredEmployees = employees.filter(e => 
      e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>👨‍💼 Empleados Registrados ({filteredEmployees.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Cargo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay empleados registrados
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id_empleado || emp.id}>
                        <td><span className="badge">{emp.id_empleado || emp.id}</span></td>
                        <td>{emp.nombre} {emp.apellidos}</td>
                        <td>{emp.email}</td>
                        <td>{emp.cargo}</td>
                        <td>
                          <span className={`status-badge ${emp.estado === 1 ? 'active' : 'inactive'}`}>
                            {emp.estado === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar gestión de libros
  const renderBookManagement = () => {
    const filteredBooks = books.filter(b => 
      b.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn?.includes(searchTerm)
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar libro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>📚 Libros Registrados ({filteredBooks.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>ISBN</th>
                    <th>Cantidad</th>
                    <th>Disponibilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay libros registrados
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book.id}>
                        <td><span className="badge">{book.id}</span></td>
                        <td>{book.titulo}</td>
                        <td>{book.isbn}</td>
                        <td>{book.cantidad || 0}</td>
                        <td>
                          <span className={`status-badge ${book.disponibilidad ? 'active' : 'inactive'}`}>
                            {book.disponibilidad ? 'Disponible' : 'No disponible'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar gestión de autores
  const renderAuthorManagement = () => {
    const filteredAuthors = authors.filter(a => 
      a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>✍️ Autores Registrados ({filteredAuthors.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Nacionalidad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuthors.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay autores registrados
                      </td>
                    </tr>
                  ) : (
                    filteredAuthors.map((author) => (
                      <tr key={author.id}>
                        <td><span className="badge">{author.id}</span></td>
                        <td>{author.nombre} {author.apellidos}</td>
                        <td>{author.nacionalidad}</td>
                        <td>
                          <span className={`status-badge ${author.estado === 1 ? 'active' : 'inactive'}`}>
                            {author.estado === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar gestión de editoriales
  const renderEditorialManagement = () => {
    const filteredEditorials = editorials.filter(e => 
      e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.pais?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar editorial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>🏢 Editoriales Registradas ({filteredEditorials.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEditorials.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay editoriales registradas
                      </td>
                    </tr>
                  ) : (
                    filteredEditorials.map((editorial) => (
                      <tr key={editorial.id}>
                        <td><span className="badge">{editorial.id}</span></td>
                        <td>{editorial.nombre}</td>
                        <td>{editorial.pais}</td>
                        <td>
                          <span className={`status-badge ${editorial.estado === 1 ? 'active' : 'inactive'}`}>
                            {editorial.estado === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar gestión de categorías
  const renderCategoryManagement = () => {
    const filteredCategories = categories.filter(c => 
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>📂 Categorías Registradas ({filteredCategories.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay categorías registradas
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td><span className="badge">{category.id}</span></td>
                        <td>{category.nombre}</td>
                        <td>{category.descripcion || '-'}</td>
                        <td>
                          <span className={`status-badge ${category.estado === 1 ? 'active' : 'inactive'}`}>
                            {category.estado === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar gestión de préstamos
  const renderLoanManagement = () => {
    const filteredLoans = loans.filter(l => 
      l.usuario_id?.toString().includes(searchTerm) ||
      l.libro_id?.toString().includes(searchTerm)
    );

    return (
      <div className="management-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar préstamo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="data-table-card">
          <h3>📖 Préstamos Registrados ({filteredLoans.length})</h3>
          {loading ? (
            <div className="loading-spinner">Cargando...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario ID</th>
                    <th>Libro ID</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Devolución</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                        No hay préstamos registrados
                      </td>
                    </tr>
                  ) : (
                    filteredLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td><span className="badge">{loan.id}</span></td>
                        <td>{loan.usuario_id}</td>
                        <td>{loan.libro_id}</td>
                        <td>{loan.fecha_prestamo}</td>
                        <td>{loan.fecha_devolucion || 'Pendiente'}</td>
                        <td>
                          <span className={`status-badge ${loan.estado === 'activo' ? 'active' : 'inactive'}`}>
                            {loan.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar reportes
  const renderReports = () => (
    <div className="reportes-content">
      <div className="content-header">
        <h2>📈 Reportes del Sistema</h2>
      </div>
      <div className="reports-grid">
        {reports.length === 0 ? (
          <div className="no-data">No hay reportes disponibles</div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className={`report-card ${report.type}`}>
              <div className="report-header">
                <h3>{report.title}</h3>
                <span className="report-date">{report.date}</span>
              </div>
              <p>{report.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Renderizar configuración
  const renderConfiguration = () => (
    <div className="configuracion-content">
      <div className="content-header">
        <h2>⚙️ Configuración del Sistema</h2>
      </div>
      <div className="config-card">
        <h3>Opciones de Configuración</h3>
        <p>Administra los parámetros del sistema bibliotecario.</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <aside className="modern-sidebar">
        <div className="sidebar-header">
          <h2>📚 BiblioTech</h2>
          <p>Panel de Administración</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                className={`nav-item ${activeView === item.id ? "active" : ""}`}
                onClick={() => handleMenuClick(item.id, item.submenu ? item.submenu[0].id : "")}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.nombre?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="user-info">
              <p className="user-name">{user?.nombre || "Admin"}</p>
              <p className="user-role">Administrador</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="modern-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default Admin;