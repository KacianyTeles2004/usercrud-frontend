import { ArrowLeft, CreditCard, MapPin, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createContext, useContext, useState } from 'react';
import { Button } from '../components/Button';
import { ReactNode } from 'react';
import axios from 'axios'; 


const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #111827;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  p {
    margin: 0;
    color: #6b7280;
  }
`;

const Price = styled.div`
  font-weight: 600;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const TotalRow = styled(SummaryRow)`
  font-weight: 600;
  font-size: 1.125rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const AddressInfo = styled.div`
  p {
    margin: 0.25rem 0;
    color: #6b7280;
  }
`;

const PaymentInfo = styled.div`
  p {
    margin: 0.25rem 0;
    color: #6b7280;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

type ItemPedido = {
  id: string;
  nome: string;
  preco: number;
  qtd: number;
  imagem?: string;
};

type Endereco = {
  tipo: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

type Pagamento = {
  tipo: 'cartao' | 'boleto';
  dados?: any;
};

type Pedido = {
  itens: ItemPedido[];
  endereco?: Endereco;
  pagamento?: Pagamento;
  frete?: number;
};

const PedidoContext = createContext<{
  pedido: Pedido;
  setPedido: React.Dispatch<React.SetStateAction<Pedido>>;
}>({
  pedido: { itens: [] },
  setPedido: () => {}
});

// Update the PedidoProvider component
export const PedidoProvider = ({ children }: { children: ReactNode }) => {
  const [pedido, setPedido] = useState<Pedido>({ itens: [] });

  return (
    <PedidoContext.Provider value={{ pedido, setPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedidoContext = () => useContext(PedidoContext);
export default function ResumoCompra() {
  const navigate = useNavigate();
  const { pedido, setPedido } = usePedidoContext();

  // Calcula valores totais
  const subtotal = pedido.itens?.reduce((total, item) => total + (item.preco * item.qtd), 0) || 0;
  const frete = pedido.frete || 15.90; // Valor mockado caso não exista
  const total = subtotal + frete;

const handleFinalizarPedido = async () => {
  try {
    // 1. Envia o pedido para o backend
    await axios.post('/api/pedidos', pedido);

    // 2. Limpa o carrinho
    setPedido({ itens: [] });

    // 3. Redireciona para a tela de pedido finalizado
    navigate('/checkout/finalizado');
  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    alert('Não foi possível finalizar o pedido. Tente novamente.');
  }
};

  return (
    <Container>
      <Title>Resumo do Pedido</Title>

      {/* Seção de Produtos */}
      <Section>
        <SectionTitle>
          <Package size={20} />
          Produtos ({pedido.itens?.length || 0})
        </SectionTitle>
        
        {pedido.itens?.map((item) => (
          <ProductItem key={item.id}>
            <ProductInfo>
              <ProductImage src={item.imagem || 'https://placehold.co/60'} alt={item.nome} />
              <ProductDetails>
                <h4>{item.nome}</h4>
                <p>{item.qtd}x</p>
              </ProductDetails>
            </ProductInfo>
            <Price>R$ {(item.preco * item.qtd).toFixed(2)}</Price>
          </ProductItem>
        ))}
      </Section>

      {/* Seção de Endereço */}
      <Section>
        <SectionTitle>
          <MapPin size={20} />
          Endereço de Entrega
        </SectionTitle>
        {pedido.endereco ? (
          <AddressInfo>
            <h4>{pedido.endereco.tipo || 'Endereço Principal'}</h4>
            <p>{pedido.endereco.logradouro}, {pedido.endereco.numero}</p>
            {pedido.endereco.complemento && <p>Complemento: {pedido.endereco.complemento}</p>}
            <p>{pedido.endereco.bairro}, {pedido.endereco.cidade} - {pedido.endereco.estado}</p>
            <p>CEP: {pedido.endereco.cep}</p>
          </AddressInfo>
        ) : (
          <p>Nenhum endereço selecionado</p>
        )}
      </Section>

      {/* Seção de Pagamento */}
      <Section>
        <SectionTitle>
          <CreditCard size={20} />
          Pagamento
        </SectionTitle>
        {pedido.pagamento ? (
          <PaymentInfo>
            <h4>
              {pedido.pagamento.tipo === 'cartao' 
                ? 'Cartão de Crédito' 
                : 'Boleto Bancário'}
            </h4>
            {pedido.pagamento.tipo === 'cartao' && (
              <p>Final {pedido.pagamento.dados?.numero?.slice(-4) || '****'}</p>
            )}
          </PaymentInfo>
        ) : (
          <p>Nenhum método de pagamento selecionado</p>
        )}
      </Section>

      {/* Resumo Financeiro */}
      <Section>
        <SummaryRow>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Frete</span>
          <span>R$ {frete.toFixed(2)}</span>
        </SummaryRow>
        <TotalRow>
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </TotalRow>
      </Section>

      {/* Ações */}
      <Actions>
        <Button 
          variant="outline" 
          onClick={() => navigate('/checkout/pagamento')}
          icon={<ArrowLeft size={18} />}
        >
          Voltar
        </Button>
        <Button 
          onClick={handleFinalizarPedido}
          disabled={!pedido.endereco || !pedido.pagamento || pedido.itens?.length === 0}
        >
          Confirmar Pedido
        </Button>
      </Actions>
    </Container>
  );
}
