import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";

const initialForm = {
  tipo: "informacao",
  titulo: "",
  conteudo: "",
  book_id: "",
  ativo: true,
};

export default function AdminPublications() {
  const [form, setForm] = useState(initialForm);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  function loadPublications() {
    setLoading(true);
    api.get("/admin/publications")
      .then(({ data }) => setPublications(data.data || []))
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Erro ao carregar publicações." }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPublications();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    api.post("/admin/publications", {
      ...form,
      book_id: form.tipo === "livro" ? form.book_id : "",
    })
      .then(() => {
        setNotice({ type: "success", text: "Publicação criada com sucesso." });
        setForm(initialForm);
        loadPublications();
      })
      .catch((err) => setNotice({ type: "error", text: err?.response?.data?.error || "Não foi possível criar a publicação." }))
      .finally(() => setSaving(false));
  }

  return (
    <AdminLayout title="Publicações">
      {notice && <div className={`admin-alert ${notice.type}`}>{notice.text}</div>}

      <section className="publication-grid">
        <article className="admin-card">
          <h2>Nova publicação</h2>
          <form className="publication-form" onSubmit={handleSubmit}>
            <label>
              Tipo
              <select value={form.tipo} onChange={(event) => updateField("tipo", event.target.value)}>
                <option value="informacao">Informação da app</option>
                <option value="livro">Publicação de livro</option>
              </select>
            </label>

            <label>
              Título
              <input
                value={form.titulo}
                onChange={(event) => updateField("titulo", event.target.value)}
                placeholder="Ex.: Novos livros disponíveis"
              />
            </label>

            {form.tipo === "livro" && (
              <label>
                ID do livro
                <input
                  type="number"
                  min="1"
                  value={form.book_id}
                  onChange={(event) => updateField("book_id", event.target.value)}
                  placeholder="Ex.: 12"
                />
              </label>
            )}

            <label>
              Conteúdo
              <textarea
                value={form.conteudo}
                onChange={(event) => updateField("conteudo", event.target.value)}
                placeholder="Escreve a informação que será publicada."
                rows="8"
              />
            </label>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(event) => updateField("ativo", event.target.checked)}
              />
              Publicar como ativo
            </label>

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? "A publicar..." : "Publicar"}
            </button>
          </form>
        </article>

        <article className="admin-card">
          <h2>Publicações recentes</h2>
          <div className="publication-list">
            {loading && <p className="empty-state">A carregar publicações...</p>}
            {!loading && publications.length === 0 && (
              <p className="empty-state">Ainda não há publicações.</p>
            )}
            {publications.map((publication) => (
              <article className="publication-item" key={publication.id}>
                <div>
                  <span>{publication.tipo === "livro" ? "Livro" : "Informação"}</span>
                  <strong>{publication.titulo}</strong>
                </div>
                <p>{publication.conteudo}</p>
                <footer>
                  <small>{publication.autor_nome || "Admin"} · {publication.created_at}</small>
                  <small>{Number(publication.ativo) === 1 ? "Ativa" : "Inativa"}</small>
                </footer>
              </article>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}
