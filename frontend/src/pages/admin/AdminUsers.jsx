import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function loadUsers(page = 1) {
    setLoading(true);
    api.get("/admin/users", { params: { page, perPage: 10, search, status } })
      .then(({ data }) => {
        setUsers(data.data || []);
        setPagination(data.pagination || { page, totalPages: 1, total: 0 });
      })
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Erro ao carregar utilizadores." }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => loadUsers(1), 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  function confirmDelete() {
    if (!deleteTarget) return;
    api.delete(`/admin/users/${deleteTarget.id}`)
      .then(() => {
        setNotice({ type: "success", text: "Utilizador excluído com sucesso." });
        setDeleteTarget(null);
        loadUsers(pagination.page);
      })
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Não foi possível excluir o utilizador." }));
  }

  return (
    <AdminLayout title="Gestão de Utilizadores">
      {notice && <div className={`admin-alert ${notice.type}`}>{notice.text}</div>}

      <section className="admin-card">
        <div className="users-toolbar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por nome ou email" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Data de registo</th>
              <th>Último login</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.created_at || "-"}</td>
                <td>{user.last_login || "-"}</td>
                <td><span className={`status-pill ${Number(user.ativo) === 1 ? "active" : "inactive"}`}>{Number(user.ativo) === 1 ? "Ativo" : "Inativo"}</span></td>
                <td><button className="danger-btn" type="button" onClick={() => setDeleteTarget(user)}>Excluir</button></td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr><td colSpan="7" className="empty-state">Nenhum utilizador encontrado.</td></tr>
            )}
            {loading && (
              <tr><td colSpan="7" className="empty-state">A carregar utilizadores...</td></tr>
            )}
          </tbody>
        </table>

        <div className="pagination-row">
          <span>{pagination.total} utilizadores</span>
          <div>
            <button type="button" disabled={pagination.page <= 1} onClick={() => loadUsers(pagination.page - 1)}>Anterior</button>
            <strong>{pagination.page} / {pagination.totalPages}</strong>
            <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => loadUsers(pagination.page + 1)}>Próxima</button>
          </div>
        </div>
      </section>

      {deleteTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h2>Excluir utilizador</h2>
            <p>Tens a certeza que queres excluir este utilizador? Esta ação é irreversível</p>
            <div>
              <button type="button" onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button type="button" className="danger-btn" onClick={confirmDelete}>Confirmar exclusão</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
