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
import PedidoFinalizado from './pages/PedidoFinalizado';
import ResumoCompra from './pages/ResumoCompra';
// import CheckoutEndereco from './pages/CheckoutEndereco'; // Mantida conforme solicitado
import CheckoutPagamento from './pages/CheckoutPagamento';
import ProtectedRoute from './services/ProtectedRoute';
import { GlobalStyles } from './styles/GlobalStyles';
import { PedidoProvider } from './components/PedidoContext';

function App() {
  return (
    <PedidoProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Header />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrar" element={<Cadastro />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/produto/:id" element={<DetalhesProduto />} />
          <Route path="/carrinho" element={<Carrinho />} />

          {/* Fluxo de Checkout - Mantido conforme original */}
          {/* <Route path="/checkout/endereco" element={<CheckoutEndereco />} /> */}
          <Route path="/checkout/pagamento" element={<CheckoutPagamento />} />
          <Route path="/checkout/resumo" element={<ResumoCompra />} />
          <Route path="/checkout/finalizado/:numero" element={<PedidoFinalizado />} />

          {/* Rotas Admin */}
          <Route element={<ProtectedRoute allowedRoles={['STOCKIST', 'ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="produtos" element={<Produtos />} />
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="usuarios" element={<Usuarios />} />
              </Route>
            </Route>
          </Route>

          {/* Rota Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PedidoProvider>
  );
}

export default App;