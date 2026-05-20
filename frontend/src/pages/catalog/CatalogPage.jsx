export default function CatalogPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff7ef', display: 'grid', placeItems: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '720px', background: '#fff', borderRadius: '28px', padding: '48px', boxShadow: '0 28px 70px rgba(61,38,17,0.12)', color: '#3b1f0e' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Bem-vindo ao catálogo</h1>
        <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#7d5b47' }}>
          O login foi realizado com sucesso. Aqui será exibido o catálogo de livros da sua biblioteca escolar assim que avançarmos para a próxima fase.
        </p>
      </div>
    </main>
  );
}
