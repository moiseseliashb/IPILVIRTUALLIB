import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

const categories = [
  { key: "admin", label: "Admin", role: "admin" },
  { key: "professor", label: "Professores", role: "professor" },
  { key: "aluno", label: "Alunos", role: "aluno" },
  { key: "todos", label: "Todos", role: "" },
];

const roleLabels = {
  admin: "Admin",
  professor: "Professor",
  aluno: "Aluno",
};

export default function AdminUsers() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [counts, setCounts] = useState({ admin: 0, professor: 0, aluno: 0, todos: 0 });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeCategory = useMemo(
    () => categories.find((category) => category.key === selectedCategory),
    [selectedCategory]
  );

  function loadCounts() {
    setLoadingCounts(true);
    api.get("/admin/utilizadores/contagem")
      .then(({ data }) => setCounts(data.data || { admin: 0, professor: 0, aluno: 0, todos: 0 }))
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Erro ao carregar contagens." }))
      .finally(() => setLoadingCounts(false));
  }

  function loadUsers(page = 1, category = activeCategory) {
    if (!category) return;

    setLoadingUsers(true);
    api.get("/admin/utilizadores", {
      params: {
        role: category.role || undefined,
        page,
        perPage: 10,
        search,
      },
    })
      .then(({ data }) => {
        setUsers(data.data || []);
        setPagination(data.pagination || { page, totalPages: 1, total: 0 });
      })
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Erro ao carregar utilizadores." }))
      .finally(() => setLoadingUsers(false));
  }

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;

    const timer = setTimeout(() => loadUsers(1, activeCategory), 250);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  function openCategory(category) {
    setSelectedCategory(category.key);
    setSearch("");
    setUsers([]);
    setPagination({ page: 1, totalPages: 1, total: 0 });
    setNotice(null);
  }

  function goBack() {
    setSelectedCategory(null);
    setSearch("");
    setUsers([]);
    setPagination({ page: 1, totalPages: 1, total: 0 });
    setDeleteTarget(null);
    loadCounts();
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    api.delete(`/admin/utilizadores/${deleteTarget.id}`)
      .then(() => {
        setNotice({ type: "success", text: "Utilizador excluído com sucesso." });
        setDeleteTarget(null);
        loadUsers(pagination.page);
        loadCounts();
      })
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Não foi possível excluir o utilizador." }));
  }

  return (
    <AdminLayout title="Gestão de Utilizadores">
      {notice && <div className={`admin-alert ${notice.type}`}>{notice.text}</div>}

      {!activeCategory && (
        <section className="user-category-grid">
          {categories.map((category) => (
            <button
              className="user-category-card"
              key={category.key}
              type="button"
              onClick={() => openCategory(category)}
            >
              <span>{category.label}</span>
              <strong>{loadingCounts ? "..." : counts[category.key] ?? 0}</strong>
            </button>
          ))}
        </section>
      )}

      {activeCategory && (
        <section className="admin-card">
          <div className="users-list-header">
            <button className="back-btn" type="button" onClick={goBack}>← Voltar</button>
            <div>
              <span>Categoria</span>
              <strong>{activeCategory.label}</strong>
            </div>
          </div>

          <div className="users-toolbar single">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por nome ou email" />
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th>Data de registo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td><span className="role-pill">{roleLabels[user.role] || user.role}</span></td>
                  <td>{user.created_at || "-"}</td>
                  <td><button className="danger-btn" type="button" onClick={() => setDeleteTarget(user)}>Excluir</button></td>
                </tr>
              ))}
              {!loadingUsers && users.length === 0 && (
                <tr><td colSpan="6" className="empty-state">Nenhum utilizador encontrado.</td></tr>
              )}
              {loadingUsers && (
                <tr><td colSpan="6" className="empty-state">A carregar utilizadores...</td></tr>
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
      )}

      {deleteTarget && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h2>Excluir utilizador</h2>
            <p>Tens a certeza que queres excluir {deleteTarget.nome}? Esta ação é irreversível.</p>
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
