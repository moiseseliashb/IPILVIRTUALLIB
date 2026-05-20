import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";

// TODO: importar páginas à medida que forem criadas
// import CatalogPage    from "./pages/catalog/CatalogPage";
// import BookDetail     from "./pages/catalog/BookDetail";
// import ReaderPage     from "./pages/reader/ReaderPage";
// import AdminDashboard from "./pages/admin/Dashboard";
// import StudentArea    from "./pages/student/StudentArea";

function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  // TODO: verificar role se necessário
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/catalogo" element={<PrivateRoute><CatalogPage /></PrivateRoute>} /> */}
          {/* <Route path="/livro/:id" element={<PrivateRoute><BookDetail /></PrivateRoute>} /> */}
          {/* <Route path="/ler/:id" element={<PrivateRoute><ReaderPage /></PrivateRoute>} /> */}
          {/* <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
