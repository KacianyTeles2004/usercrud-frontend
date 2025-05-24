import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Tipos para os itens do pedido
type ItemPedido = {
  id: string;
  nome: string;
  preco: number;
  qtd: number;
  imagem?: string;
};

// Tipo para o endereço de entrega
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

// Tipo para os dados de pagamento
type Pagamento = {
  tipo: 'cartao' | 'boleto';
  dados?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
  };
};

// Tipo principal do pedido
type Pedido = {
  itens: ItemPedido[];
  endereco?: Endereco;
  pagamento?: Pagamento;
  frete?: number;
};

// Tipo do contexto
type PedidoContextType = {
  pedido: Pedido;
  setPedido: Dispatch<SetStateAction<Pedido>>;
};

// Criação do contexto com valores padrão
const PedidoContext = createContext<PedidoContextType>({
  pedido: { itens: [] },
  setPedido: () => {}
});

// Provider do contexto
export const PedidoProvider = ({ children }: { children: ReactNode }) => {
  const [pedido, setPedido] = useState<Pedido>({ 
    itens: [],
    frete: 15.90 // Valor padrão do frete
  });

  return (
    <PedidoContext.Provider value={{ pedido, setPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const usePedidoContext = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoContext deve ser usado dentro de um PedidoProvider');
  }
  return context;
};