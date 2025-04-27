import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { GlobalStyles } from './styles/GlobalStyles';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Usuarios } from './pages/admin/Usuarios';
import { Produtos } from './pages/admin/Produtos';
import { Carrinho } from './pages/Carrinho';
import DetalhesProduto from './pages/DetalhesProduto';
import Configuracoes from './pages/Configuracoes';
import ProtectedRoute from './services/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route element={<ProtectedRoute allowedRoles={['STOCKIST', 'ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="produtos" element={<Produtos />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="usuarios" element={<Usuarios />} />
            </Route>
          </Route>
        </Route>
        <Route path="/carrinho" element={<Carrinho />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;