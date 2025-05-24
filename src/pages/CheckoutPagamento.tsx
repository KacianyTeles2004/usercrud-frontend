import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import * as S from '../styles/CheckoutPagamento';
import { Button } from '../components/Button/index.js';
import { usePedidoContext } from '../components/PedidoContext.js';
import { maskCreditCard, maskExpiryDate, maskCVV } from './utils/masks.js';

export default function CheckoutPagamento() {
  const navigate = useNavigate();
  const { pedido, setPedido } = usePedidoContext();
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'boleto' | null>(null);
  const [cardData, setCardData] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializa com os dados existentes se houver
  useEffect(() => {
    if (pedido.pagamento) {
        setPaymentMethod(pedido.pagamento.tipo);
      if (pedido.pagamento.tipo === 'cartao' && pedido.pagamento.dados) {
        setCardData(pedido.pagamento.dados);
      }
    }
  }, [pedido.pagamento]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'cartao') {
      if (!cardData.numero || cardData.numero.replace(/\D/g, '').length !== 16) {
        newErrors.numero = 'Número do cartão inválido';
      }
      if (!cardData.nome.trim()) {
        newErrors.nome = 'Nome no cartão é obrigatório';
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardData.validade)) {
        newErrors.validade = 'Validade inválida (MM/AA)';
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        newErrors.cvv = 'CVV inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplica máscaras
    if (name === 'numero') {
      formattedValue = maskCreditCard(value);
    } else if (name === 'validade') {
      formattedValue = maskExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = maskCVV(value);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async () => {
    if (!paymentMethod) return;
    
    if (paymentMethod === 'cartao' && !validateFields()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      setPedido({
        ...pedido,
        pagamento: {
          tipo: paymentMethod,
          ...(paymentMethod === 'cartao' && { dados: cardData })
        }
      });

      navigate('/checkout/resumo');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = paymentMethod === 'boleto' || 
    (paymentMethod === 'cartao' && 
     cardData.numero.replace(/\D/g, '').length === 16 &&
     cardData.nome.trim() &&
     /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardData.validade) &&
     cardData.cvv.length >= 3);

  return (
    <S.Container>
      <S.Title>Pagamento</S.Title>

      <S.PaymentOption
        selected={paymentMethod === 'cartao'}
        onClick={() => setPaymentMethod('cartao')}
        role="radio"
        aria-checked={paymentMethod === 'cartao'}
      >
        <S.PaymentHeader>
          <CreditCard size={20} color="#A23F3F" />
          <S.PaymentTitle>Cartão de Crédito</S.PaymentTitle>
        </S.PaymentHeader>
        <S.PaymentDescription>Parcelamento em até 12x</S.PaymentDescription>
        {paymentMethod === 'cartao' && (
          <S.CardForm>
            <S.InputGroup>
              <S.Label htmlFor="numero">Número do Cartão</S.Label>
              <S.Input
                id="numero"
                type="text"
                name="numero"
                placeholder="0000 0000 0000 0000"
                value={cardData.numero}
                onChange={handleCardChange}
                maxLength={19}
                aria-describedby="numero-help"
                aria-invalid={!!errors.numero}
              />
              {errors.numero && <S.ErrorMessage id="numero-help">{errors.numero}</S.ErrorMessage>}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label htmlFor="nome">Nome no Cartão</S.Label>
              <S.Input
                id="nome"
                type="text"
                name="nome"
                placeholder="Como no cartão"
                value={cardData.nome}
                onChange={handleCardChange}
                aria-describedby="nome-help"
                aria-invalid={!!errors.nome}
              />
              {errors.nome && <S.ErrorMessage id="nome-help">{errors.nome}</S.ErrorMessage>}
            </S.InputGroup>

            <S.InputRow>
              <S.InputGroup>
                <S.Label htmlFor="validade">Validade</S.Label>
                <S.Input
                  id="validade"
                  type="text"
                  name="validade"
                  placeholder="MM/AA"
                  value={cardData.validade}
                  onChange={handleCardChange}
                  maxLength={5}
                  aria-describedby="validade-help"
                  aria-invalid={!!errors.validade}
                />
                {errors.validade && <S.ErrorMessage id="validade-help">{errors.validade}</S.ErrorMessage>}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label htmlFor="cvv">CVV</S.Label>
                <S.Input
                  id="cvv"
                  type="text"
                  name="cvv"
                  placeholder="000"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                  maxLength={4}
                  aria-describedby="cvv-help"
                  aria-invalid={!!errors.cvv}
                />
                {errors.cvv && <S.ErrorMessage id="cvv-help">{errors.cvv}</S.ErrorMessage>}
              </S.InputGroup>
            </S.InputRow>
          </S.CardForm>
        )}
      </S.PaymentOption>

      <S.PaymentOption
        selected={paymentMethod === 'boleto'}
        onClick={() => setPaymentMethod('boleto')}
        role="radio"
        aria-checked={paymentMethod === 'boleto'}
      >
        <S.PaymentHeader>
          <Banknote size={20} color="#A23F3F" />
          <S.PaymentTitle>Boleto Bancário</S.PaymentTitle>
        </S.PaymentHeader>
        <S.PaymentDescription>Desconto de 5% no pagamento à vista</S.PaymentDescription>
      </S.PaymentOption>

      <S.Actions>
        <Button
          variant="outline"
          onClick={() => navigate('/checkout/endereco')}
          icon={<ArrowLeft size={18} />}
        >
          Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Processando...' : 'Continuar'}
        </Button>
      </S.Actions>
    </S.Container>
  );
}
