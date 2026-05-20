import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:      #3b1f0e;
    --paper:    #fff7ef;
    --cream:    #fff4e6;
    --sun:      #ff9b4b;
    --sun-lt:   #ffd8b3;
    --peach:    #ffb878;
    --caramel:  #f27b30;
    --muted:    #7d5b47;
    --line:     rgba(61,38,17,0.12);
    --shadow:   0 24px 48px rgba(61,38,17,0.12);
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
    background: linear-gradient(145deg, #fff4e6 0%, #ffba78 48%, #ff9b4b 100%);
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
      radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35) 0%, transparent 30%),
      radial-gradient(circle at 85% 35%, rgba(255,255,255,0.22) 0%, transparent 28%),
      repeating-linear-gradient(135deg, transparent, transparent 36px, rgba(255,255,255,0.07) 36px, rgba(255,255,255,0.07) 38px);
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
    background: #ff914d;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 18px 40px rgba(255,149,77,0.18);
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

  .illustration-card {
    margin-top: 30px;
    width: 100%;
    max-width: 360px;
    border-radius: 30px;
    overflow: hidden;
    background: rgba(255,255,255,0.85);
    box-shadow: 0 26px 60px rgba(61,38,17,0.12);
  }

  .illustration-card svg {
    display: block;
    width: 100%;
    height: auto;
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
    color: #3b1f0e;
    line-height: 1.15;
    margin-bottom: 24px;
  }

  .left-title em {
    font-style: italic;
    color: var(--sun);
  }

  .left-desc {
    font-size: 15px;
    color: rgba(61,38,17,0.72);
    line-height: 1.75;
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
    max-width: 420px;
    background: #fff;
    border-radius: 26px;
    padding: 42px 40px;
    box-shadow: var(--shadow);
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
    background: linear-gradient(90deg, #ff8b3c, #ffb86b);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
    box-shadow: 0 18px 30px rgba(242,123,48,0.16);
  }

  .btn-login:hover { opacity: 0.96; }
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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor preenche todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/catalogo", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.error || "Falha ao iniciar sessão. Verifica o email e a palavra-passe.";
      setError(message);
    } finally {
      setLoading(false);
    }
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

            <div className="illustration-card">
              <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="warmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fff1e0" />
                    <stop offset="100%" stop-color="#ffd3a4" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="420" height="300" rx="28" fill="url(#warmGradient)" />
                <path d="M80 220c0-44 38-80 85-80s85 36 85 80" fill="#ff9b4b" opacity="0.16" />
                <path d="M58 202c12-18 32-30 56-30 30 0 55 22 58 50H58c0-6 1-12 2-20z" fill="#fff" opacity="0.55" />
                <rect x="128" y="96" width="168" height="126" rx="22" fill="#ffd8b3" />
                <rect x="144" y="116" width="132" height="88" rx="16" fill="#fff" />
                <path d="M172 158h96" stroke="#ff914d" stroke-width="12" stroke-linecap="round" />
                <path d="M172 184h96" stroke="#ff914d" stroke-width="12" stroke-linecap="round" />
                <circle cx="300" cy="136" r="36" fill="#ff914d" />
                <circle cx="302" cy="132" r="20" fill="#ffdfc2" />
                <path d="M290 154c12 18 24 22 34 16" stroke="#bf5f26" stroke-width="10" stroke-linecap="round" />
                <path d="M92 182c18-30 55-42 82-27" stroke="#f27b30" stroke-width="18" stroke-linecap="round" opacity="0.8" />
                <path d="M88 84c16-22 42-32 66-26" stroke="#ffb86b" stroke-width="16" stroke-linecap="round" opacity="0.8" />
              </svg>
            </div>
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
