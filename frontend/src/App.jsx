import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import CatalogPage from "./pages/catalog/CatalogPage";
import { AuthProvider } from "./contexts/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPublications from "./pages/admin/AdminPublications";

// TODO: importar páginas à medida que forem criadas
// import BookDetail     from "./pages/catalog/BookDetail";
// import ReaderPage     from "./pages/reader/ReaderPage";
// import AdminDashboard from "./pages/admin/Dashboard";
// import StudentArea    from "./pages/student/StudentArea";

function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!token) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalogo" element={<PrivateRoute><CatalogPage /></PrivateRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={["admin"]}><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/publicacoes" element={<PrivateRoute roles={["admin"]}><AdminPublications /></PrivateRoute>} />
          {/* <Route path="/livro/:id" element={<PrivateRoute><BookDetail /></PrivateRoute>} /> */}
          {/* <Route path="/ler/:id" element={<PrivateRoute><ReaderPage /></PrivateRoute>} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
