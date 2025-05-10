import { CheckCircle, Clock, ArrowLeft,CreditCard, Truck, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../components/Button';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  color: #10B981;
  margin-bottom: 1.5rem;
  
  svg {
    width: 80px;
    height: 80px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #111827;
  margin-bottom: 1rem;
`;

const OrderNumber = styled.div`
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #F3F4F6;
  border-radius: 8px;
  display: inline-block;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #F3F4F6;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoText = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.25rem 0;
    color: #111827;
  }
  
  p {
    margin: 0;
    color: #6B7280;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export default function PedidoFinalizado() {
  const navigate = useNavigate();
  
  // Dados mockados - substitua pelos dados reais do pedido
  const pedido = {
    numero: Math.random().toString(36).substring(2, 10).toUpperCase(),
    data: new Date().toLocaleDateString('pt-BR'),
    status: 'PAGO',
    valorTotal: 287.90,
    pagamento: 'Cartão de Crédito **** 4242',
    endereco: 'Rua das Flores, 123 - Apt 101, São Paulo/SP'
  };

  return (
    <Container>
      <SuccessIcon>
        <CheckCircle />
      </SuccessIcon>
      
      <Title>Pedido Confirmado!</Title>
      <p>Seu pedido foi recebido e está sendo processado.</p>
      
      <OrderNumber>Nº do pedido: #{pedido.numero}</OrderNumber>
      
      <InfoCard>
        <InfoItem>
          <Clock color="#F59E0B" />
          <InfoText>
            <h4>Status do Pedido</h4>
            <p>{pedido.status === 'PAGO' ? 'Pagamento aprovado' : 'Processando pagamento'}</p>
          </InfoText>
        </InfoItem>
        
        <InfoItem>
          <CreditCard color="#4F46E5" />
          <InfoText>
            <h4>Forma de Pagamento</h4>
            <p>{pedido.pagamento}</p>
          </InfoText>
        </InfoItem>
        
        <InfoItem>
          <Truck color="#A23F3F" />
          <InfoText>
            <h4>Endereço de Entrega</h4>
            <p>{pedido.endereco}</p>
          </InfoText>
        </InfoItem>
      </InfoCard>
      
      <p>Enviamos os detalhes do pedido para o seu e-mail.</p>
      
      <ActionButtons>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={18} />}
        >
          Continuar Comprando
        </Button>
        
        <Button 
          onClick={() => navigate('/meus-pedidos')}
        >
          Acompanhar Pedidos
        </Button>
      </ActionButtons>
    </Container>
  );
}