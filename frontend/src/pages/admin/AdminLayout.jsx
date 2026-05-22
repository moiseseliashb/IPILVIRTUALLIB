import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./admin.css";

export default function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <div className="admin-brand-mark">IP</div>
            <div>
              <strong>Admin</strong>
              <span>Biblioteca Virtual</span>
            </div>
          </div>

          <nav className="admin-nav" aria-label="Admin">
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/utilizadores">Utilizadores</NavLink>
            <NavLink to="/admin/publicacoes">Publicações</NavLink>
          </nav>
        </div>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p>Painel de administração</p>
            <h1>{title}</h1>
          </div>
          <div className="admin-user-chip">
            <span>{user?.nome || "Administrador"}</span>
            <small>{user?.email}</small>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
