import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../components/Button';
import listarPedidosPorUsuario from '../services/axiosServices';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 2rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
`;

const OrderInfo = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const OrderStatus = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => 
    props.status === 'ENTREGUE' ? '#10B981' :
    props.status === 'CANCELADO' ? '#EF4444' :
    '#F59E0B'};
`;

const OrderProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;

  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
`;

interface Pedido {
  id: number;
  numeroPedido: string;
  data: string;
  status: 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  valorTotal: number;
  itens: {
    id: number;
    nome: string;
    quantidade: number;
    preco: number;
    imagem: string;
  }[];
}

export function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('user') || '{}');
        if (usuario?.id) {
          const response = await listarPedidosPorUsuario(usuario.id);
          setPedidos(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return <CheckCircle size={18} />;
      case 'CANCELADO':
        return <XCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  if (loading) {
    return <Container>Carregando...</Container>;
  }

  return (
    <Container>
      <Title>Meus Pedidos</Title>

      {pedidos.length === 0 ? (
        <EmptyState>
          <h3>Você ainda não fez nenhum pedido</h3>
          <p>Quando você fizer um pedido, ele aparecerá aqui.</p>
          <Button onClick={() => navigate('/')}>Continuar Comprando</Button>
        </EmptyState>
      ) : (
        pedidos.map((pedido) => (
          <OrderCard key={pedido.id}>
            <OrderHeader>
              <OrderInfo>
                <div>
                  <strong>Pedido #{pedido.numeroPedido}</strong>
                  <p>Feito em {formatarData(pedido.data)}</p>
                </div>
                <div>
                  <strong>Total: R$ {pedido.valorTotal.toFixed(2)}</strong>
                </div>
              </OrderInfo>
              
              <OrderStatus status={pedido.status}>
                {getStatusIcon(pedido.status)}
                <span>
                  {pedido.status === 'PENDENTE' && 'Pagamento Pendente'}
                  {pedido.status === 'PAGO' && 'Pagamento Aprovado'}
                  {pedido.status === 'ENVIADO' && 'Enviado'}
                  {pedido.status === 'ENTREGUE' && 'Entregue'}
                  {pedido.status === 'CANCELADO' && 'Cancelado'}
                </span>
              </OrderStatus>
            </OrderHeader>

            <div>
              <h4>Itens do Pedido</h4>
              <OrderProducts>
                {pedido.itens.map((item) => (
                  <ProductItem key={item.id}>
                    <ProductImage 
                      src={item.imagem || 'https://placehold.co/50'} 
                      alt={item.nome} 
                    />
                    <div>
                      <p>{item.nome}</p>
                      <small>{item.quantidade}x R$ {item.preco.toFixed(2)}</small>
                    </div>
                  </ProductItem>
                ))}
              </OrderProducts>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => navigate(`/pedidos/${pedido.id}`)}
              >
                Ver Detalhes
              </Button>
              {pedido.status === 'PENDENTE' && (
                <Button variant="primary">
                  Pagar Novamente
                </Button>
              )}
            </div>
          </OrderCard>
        ))
      )}
    </Container>
  );
}