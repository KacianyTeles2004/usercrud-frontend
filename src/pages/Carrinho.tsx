import styled from 'styled-components';
import { Button } from '../components/Button';
import { Search, ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { aumentarQuantidade, calcularSubtotal, diminuirQuantidade, getCarrinhoItems, removerDoCarrinho } from './utils/carrinhoUtils';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const CartContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;
const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 2rem;
`;
const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
`;
const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;
const ProductInfo = styled.div`
  flex: 1;
`;
const ProductName = styled.h3`
  font-size: 1.125rem;
  color: #111827;
  margin-bottom: 0.5rem;
`;
const ProductPrice = styled.p`
  color: #2563eb;
  font-weight: 600;
`;
const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const CartSummary = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
`;
const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 1.125rem;
  }
`;
const ShippingOptions = styled.div`
  margin: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;
const ShippingTitle = styled.h3`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const ShippingOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #2563eb;
  }
  input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: #2563eb;
  }
`;
const ShippingInfo = styled.div`
  flex: 1;
`;
const ShippingName = styled.p`
  font-weight: 500;
  color: #111827;
`;
const DeliveryTime = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;
const ShippingPrice = styled.p`
  font-weight: 600;
  color: #2563eb;
`;
const CepContainer = styled.div`
  margin: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;
const CepInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
const CepInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  flex: 1;
  font-size: 0.875rem;
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }
`;

interface CartItem {
  id: number;
  nome: string;
  preco: number;
  qtd: number;
  imagem?: string;
}

export function Carrinho() {
  const [selectedShipping, setSelectedShipping] = useState('pac');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [cep, setCep] = useState('');
  const [freteOptions, setFreteOptions] = useState<any>(null);
  const [isLoadingFrete, setIsLoadingFrete] = useState(false);
  useEffect(() => {
    // Carregar itens do carrinho ao montar o componente
    loadCartItems();
  }, []);

  const navigate = useNavigate();
  
  const loadCartItems = () => {
    const items = getCarrinhoItems();
    setCartItems(items);
    setSubtotal(calcularSubtotal());
  };
  const handleIncreaseQuantity = (id: number) => {
    aumentarQuantidade(id);
    loadCartItems();
  };
  const handleDecreaseQuantity = (id: number) => {
    diminuirQuantidade(id);
    loadCartItems();
  };
  const handleRemoveItem = (id: number) => {
    removerDoCarrinho(id);
    loadCartItems();
  };
  const formatarCep = (value: string) => {
    return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);
  };
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCep(formatarCep(e.target.value));
  };
  const calcularFreteHandler = async () => {
    if (cep.length < 8) {
      toast.error('Por favor, digite um CEP válido');
      return;
    }
    setIsLoadingFrete(true);
    
    // Simulando uma chamada de API com um pequeno atraso
    setTimeout(() => {
      // Dados mockados para o frete
      setFreteOptions({
        pac: {
          name: 'Correios PAC',
          price: 9.50,
          time: '6-8 dias úteis'
        },
        sedex: {
          name: 'Correios SEDEX',
          price: 13.90,
          time: '2-3 dias úteis'
        },
        express: {
          name: 'SEDEX 10',
          price: 19.90,
          time: 'Próximo dia útil'
        }
      });
      setSelectedShipping('pac');
      setIsLoadingFrete(false);
    }, 1000); // Simulando 1 segundo de delay para dar impressão de carregamento
  };
  // Calcula o valor total com frete apenas se o frete foi calculado
  const shippingPrice = freteOptions ? freteOptions[selectedShipping].price : 0;
  const total = subtotal + shippingPrice;

  const finalizarCompra = () => {
    if (!freteOptions) {
      toast.error('Por favor, calcule o frete antes de finalizar a compra');
      return;
    }

    // Aqui você pode adicionar a lógica para finalizar a compra
    toast.success('Compra finalizada com sucesso!');  
    navigate('/checkout/pagamento');
  }

  return (
    <CartContainer>
      <Title>Carrinho de Compras</Title>
      {cartItems.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: 'white', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h2 style={{ marginBottom: '1rem' }}>Seu carrinho está vazio</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Adicione produtos para continuar comprando
          </p>
          <Button 
            to="/"
            style={{ width: 'auto', margin: '0 auto' }}
          >
            Continuar Comprando
          </Button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem key={item.id}>
              <ProductImage 
                src={item.imagem || "https://placehold.co/100"} 
                alt={item.nome} 
              />
              <ProductInfo>
                <ProductName>{item.nome}</ProductName>
                <ProductPrice>R${item.preco.toFixed(2)}</ProductPrice>
              </ProductInfo>
              <QuantityControl>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => handleDecreaseQuantity(item.id)}
                >
                  -
                </Button>
                <span>{item.qtd}</span>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={() => handleIncreaseQuantity(item.id)}
                >
                  +
                </Button>
              </QuantityControl>
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => handleRemoveItem(item.id)}
              >
                <Trash2 size={18} />
              </Button>
            </CartItem>
          ))}
          <CartSummary>
            <SummaryRow>
              <span>Subtotal</span>
              <span>R${subtotal.toFixed(2)}</span>
            </SummaryRow>
            {/* Seção de cálculo de frete */}
            <CepContainer>
              <ShippingTitle>
                <Truck size={20} />
                Calcular Frete
              </ShippingTitle>
              
              <CepInputContainer>
                <CepInput 
                  type="text" 
                  placeholder="Digite seu CEP" 
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={9}
                />
                <Button 
                  onClick={calcularFreteHandler}
                  disabled={isLoadingFrete}
                >
                  {isLoadingFrete ? "Calculando..." : (
                    <>
                      <Search size={18} />
                      Buscar
                    </>
                  )}
                </Button>
              </CepInputContainer>
              
              {freteOptions && (
                <ShippingOptions>
                  <ShippingTitle>
                    <Truck size={20} />
                    Opções de Entrega
                  </ShippingTitle>
                  
                  {Object.entries(freteOptions).map(([key, option]: [string, any]) => (
                    <ShippingOption key={key}>
                      <input
                        type="radio"
                        name="shipping"
                        value={key}
                        checked={selectedShipping === key}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                      />
                      <ShippingInfo>
                        <ShippingName>{option.name}</ShippingName>
                        <DeliveryTime>{option.time}</DeliveryTime>
                      </ShippingInfo>
                      <ShippingPrice>R${option.price.toFixed(2)}</ShippingPrice>
                    </ShippingOption>
                  ))}
                </ShippingOptions>
              )}
            </CepContainer>
            {freteOptions && (
              <SummaryRow>
                <span>Frete</span>
                <span>R${shippingPrice.toFixed(2)}</span>
              </SummaryRow>
            )}
            
            <SummaryRow>
              <span>Total</span>
              <span>R${total.toFixed(2)}</span>
            </SummaryRow>
            <Button 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={!freteOptions}
              onClick={() => finalizarCompra()}
            >
              {!freteOptions ? 'Calcule o frete para continuar' : 'Finalizar compra'}
            </Button>
          </CartSummary>
        </>
      )}
      <ToastContainer />
    </CartContainer>
  );
}