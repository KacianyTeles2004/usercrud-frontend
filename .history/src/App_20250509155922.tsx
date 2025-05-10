import CheckoutEndereco from './pages/CheckoutEndereco';
import CheckoutPagamento from './pages/CheckoutPagamento';
import CheckoutResumo from './pages/CheckoutResumo';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Produtos } from './pages/admin/Produtos';
import { Usuarios } from './pages/admin/Usuarios';
import { Cadastro } from './pages/Cadastro';
import { Carrinho } from './pages/Carrinho';
import Configuracoes from './pages/Configuracoes';
import DetalhesProduto from './pages/DetalhesProduto';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import ProtectedRoute from './services/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <Routes>
        <Route path="/checkout/endereco" element={<CheckoutEndereco />} />
        <Route path="/checkout/pagamento" element={<CheckoutPagamento />} />
        <Route path="/checkout/resumo" element={<CheckoutResumo />} />
        <Route path="/checkout/finalizado" element={<PedidoFinalizado />} />
        
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
