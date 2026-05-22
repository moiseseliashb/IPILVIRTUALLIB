import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

const fmt = new Intl.NumberFormat("pt-AO");

function LineChart({ data }) {
  const values = data.map((item) => Number(item.total));
  const max = Math.max(1, ...values);
  const points = data.map((item, index) => {
    const x = data.length <= 1 ? 300 : 32 + (index * 536) / (data.length - 1);
    const y = 220 - (Number(item.total) / max) * 170;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="chart-box">
      <svg viewBox="0 0 600 250" role="img" aria-label="Crescimento de utilizadores">
        <polyline points={points} fill="none" stroke="#E07820" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((item, index) => {
          const x = data.length <= 1 ? 300 : 32 + (index * 536) / (data.length - 1);
          const y = 220 - (Number(item.total) / max) * 170;
          return <circle key={item.month} cx={x} cy={y} r="5" fill="#10B981" />;
        })}
      </svg>
      <div className="chart-labels">
        {data.map((item) => <span key={item.month}>{item.month}</span>)}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(1, ...data.map((item) => Number(item.total)));

  return (
    <div className="bar-list">
      {data.map((item) => (
        <div className="bar-row" key={item.category}>
          <span>{item.category}</span>
          <div><i style={{ width: `${(Number(item.total) / max) * 100}%` }} /></div>
          <strong>{item.total}</strong>
        </div>
      ))}
      {data.length === 0 && <p className="empty-state">Ainda não há dados de categorias.</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    api.get("/admin/stats")
      .then(({ data }) => setState({ loading: false, error: "", data }))
      .catch((err) => setState({
        loading: false,
        error: err?.response?.data?.error || "Não foi possível carregar o dashboard.",
        data: null,
      }));
  }, []);

  const metrics = useMemo(() => ([
    ["Total de utilizadores", state.data?.metrics?.totalUsers ?? 0],
    ["Favoritos guardados", state.data?.metrics?.totalFavorites ?? 0],
    ["Novos nos últimos 30 dias", state.data?.metrics?.newUsers30Days ?? 0],
    ["Ativos nos últimos 7 dias", state.data?.metrics?.activeUsers7Days ?? 0],
  ]), [state.data]);

  return (
    <AdminLayout title="Dashboard">
      {state.loading && <div className="admin-card">A carregar dados...</div>}
      {state.error && <div className="admin-alert">{state.error}</div>}

      {state.data && (
        <>
          <section className="metric-grid">
            {metrics.map(([label, value]) => (
              <article className="metric-card" key={label}>
                <span>{label}</span>
                <strong>{fmt.format(value)}</strong>
              </article>
            ))}
          </section>

          <section className="admin-grid">
            <article className="admin-card">
              <h2>Crescimento de utilizadores</h2>
              <LineChart data={state.data.userGrowth || []} />
            </article>
            <article className="admin-card">
              <h2>Categorias mais favoritadas</h2>
              <BarChart data={state.data.favoriteCategories || []} />
            </article>
          </section>

          <section className="admin-card">
            <h2>5 utilizadores mais recentes</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Registo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {(state.data.recentUsers || []).map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>{user.created_at || "-"}</td>
                    <td><span className={`status-pill ${Number(user.ativo) === 1 ? "active" : "inactive"}`}>{Number(user.ativo) === 1 ? "Ativo" : "Inativo"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </AdminLayout>
  );
}
