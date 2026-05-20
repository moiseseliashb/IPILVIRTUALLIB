import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:       #1a1714;
    --paper:     #f5f0e8;
    --cream:     #ede8dc;
    --gold:      #b8860b;
    --gold-lt:   #d4a020;
    --rust:      #8b3a1e;
    --muted:     #6b6255;
    --line:      rgba(26,23,20,0.12);
    --shadow:    0 2px 24px rgba(26,23,20,0.10);
  }

  .login-root {
    min-height: 100vh;
    background: var(--paper);
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── LADO ESQUERDO ── */
  .panel-left {
    background: var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 56px;
    position: relative;
    overflow: hidden;
  }

  .panel-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.035) 39px, rgba(255,255,255,0.035) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px);
    pointer-events: none;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
  }

  .brand-icon {
    width: 44px;
    height: 44px;
    background: var(--gold);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-icon svg { width: 24px; height: 24px; fill: var(--ink); }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 500;
    color: #f5f0e8;
    line-height: 1.2;
  }

  .brand-sub {
    font-size: 11px;
    color: rgba(245,240,232,0.45);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .left-body {
    position: relative;
  }

  .left-eyebrow {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }

  .left-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 700;
    color: #f5f0e8;
    line-height: 1.15;
    margin-bottom: 24px;
  }

  .left-title em {
    font-style: italic;
    color: var(--gold-lt);
  }

  .left-desc {
    font-size: 15px;
    color: rgba(245,240,232,0.55);
    line-height: 1.7;
    max-width: 340px;
  }

  .left-stats {
    display: flex;
    gap: 40px;
    position: relative;
    padding-top: 40px;
    border-top: 1px solid rgba(245,240,232,0.10);
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--gold-lt);
  }

  .stat-label {
    font-size: 12px;
    color: rgba(245,240,232,0.45);
    margin-top: 2px;
    letter-spacing: 0.04em;
  }

  /* ── LADO DIREITO ── */
  .panel-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    background: var(--paper);
  }

  .form-card {
    width: 100%;
    max-width: 400px;
  }

  .form-eyebrow {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .form-subtitle {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 40px;
    line-height: 1.5;
  }

  .form-group {
    margin-bottom: 22px;
  }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .input-wrap {
    position: relative;
  }

  .input-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    stroke: var(--muted);
    stroke-width: 1.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
    transition: stroke 0.2s;
  }

  .form-input {
    width: 100%;
    padding: 13px 14px 13px 44px;
    background: var(--cream);
    border: 1.5px solid var(--line);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder { color: rgba(107,98,85,0.5); }

  .form-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(184,134,11,0.12);
  }

  .form-input:focus + svg,
  .input-wrap:focus-within svg { stroke: var(--gold); }

  .toggle-pass {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: var(--muted);
    display: flex;
    align-items: center;
  }

  .toggle-pass svg {
    position: static !important;
    transform: none !important;
    width: 18px;
    height: 18px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    pointer-events: none;
  }

  .form-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .remember-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--muted);
    cursor: pointer;
    user-select: none;
  }

  .remember-label input { display: none; }

  .checkbox-box {
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--line);
    border-radius: 5px;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }

  .checkbox-box.checked {
    background: var(--gold);
    border-color: var(--gold);
  }

  .checkbox-box svg {
    width: 11px;
    height: 11px;
    stroke: #fff;
    stroke-width: 2.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.15s, transform 0.15s;
  }

  .checkbox-box.checked svg { opacity: 1; transform: scale(1); }

  .forgot-link {
    font-size: 13px;
    color: var(--gold);
    text-decoration: none;
    font-weight: 500;
  }

  .forgot-link:hover { color: var(--gold-lt); }

  .btn-login {
    width: 100%;
    padding: 15px;
    background: var(--ink);
    color: var(--paper);
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: background 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
  }

  .btn-login:hover { background: #2e2b27; }
  .btn-login:active { transform: scale(0.99); }
  .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

  .btn-login .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(245,240,232,0.3);
    border-top-color: var(--paper);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  .btn-number {
    width: 100%;
    padding: 14px;
    background: transparent;
    color: var(--ink);
    border: 1.5px solid var(--line);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    letter-spacing: 0.01em;
  }

  .btn-number:hover {
    border-color: var(--gold);
    background: rgba(184,134,11,0.05);
  }

  .error-msg {
    margin-bottom: 18px;
    padding: 12px 16px;
    background: rgba(139,58,30,0.08);
    border: 1px solid rgba(139,58,30,0.25);
    border-radius: 8px;
    font-size: 13px;
    color: var(--rust);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .panel-left { display: none; }
    .panel-right { padding: 32px 24px; align-items: flex-start; padding-top: 56px; }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor preenche todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulação de chamada à API
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    // Exemplo de erro retornado pela API:
    setError("Credenciais incorretas. Verifica o teu email e palavra-passe.");
    // Em produção: redirecionar com react-router após sucesso
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">

        {/* ── Painel esquerdo ── */}
        <div className="panel-left">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Biblioteca Virtual</div>
              <div className="brand-sub">Escola Secundária</div>
            </div>
          </div>

          <div className="left-body">
            <div className="left-eyebrow">Bem-vindo de volta</div>
            <h1 className="left-title">
              O saber<br />está a um<br /><em>clique</em>.
            </h1>
            <p className="left-desc">
              Acede ao catálogo completo da biblioteca escolar,
              requisita livros, lê online e acompanha o teu progresso de leitura.
            </p>
          </div>

          <div className="left-stats">
            <div>
              <div className="stat-num">1 240</div>
              <div className="stat-label">Títulos disponíveis</div>
            </div>
            <div>
              <div className="stat-num">320</div>
              <div className="stat-label">Alunos ativos</div>
            </div>
            <div>
              <div className="stat-num">48</div>
              <div className="stat-label">Categorias</div>
            </div>
          </div>
        </div>

        {/* ── Painel direito ── */}
        <div className="panel-right">
          <div className="form-card">
            <div className="form-eyebrow">Área do aluno</div>
            <h2 className="form-title">Entrar na conta</h2>
            <p className="form-subtitle">
              Usa o email escolar e a tua palavra-passe para aceder.
            </p>

            {error && (
              <div className="error-msg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email escolar</label>
                <div className="input-wrap">
                  <input
                    className="form-input"
                    type="email"
                    placeholder="nome@escola.ao"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Palavra-passe</label>
                <div className="input-wrap">
                  <input
                    className="form-input"
                    type={showPass ? "text" : "password"}
                    placeholder="A tua palavra-passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: "48px" }}
                  />
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <button
                    type="button"
                    className="toggle-pass"
                    onClick={() => setShowPass(v => !v)}
                    aria-label={showPass ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                  >
                    <svg viewBox="0 0 24 24">
                      {showPass ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-footer-row">
                <label className="remember-label">
                  <input type="checkbox" checked={remember} onChange={() => setRemember(v => !v)} />
                  <div className={`checkbox-box${remember ? " checked" : ""}`}>
                    <svg viewBox="0 0 12 12">
                      <polyline points="2,6 5,9 10,3"/>
                    </svg>
                  </div>
                  Lembrar-me
                </label>
                <a href="#" className="forgot-link">Esqueci a senha</a>
              </div>

              <button className="btn-login" type="submit" disabled={loading}>
                {loading ? <span className="spinner"/> : null}
                {loading ? "A entrar…" : "Entrar na biblioteca"}
              </button>
            </form>

            <div className="divider">ou</div>

            <button className="btn-number" type="button">
              Entrar com número de aluno
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
