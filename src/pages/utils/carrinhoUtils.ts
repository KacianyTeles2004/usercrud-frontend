export interface CartItem {
    id: number;
    nome: string;
    preco: number;
    qtd: number;
    imagem: string;
  }
  
  export const getTotalItensCarrinho = (): number => {
      const storedCarrinho = localStorage.getItem('carrinho');
      if (!storedCarrinho) return 0;
  
      const carrinho = JSON.parse(storedCarrinho);
      return carrinho.reduce((total: number, item: { qtd: number }) => total + item.qtd, 0);
  };
  
  export const getCarrinhoItems = (): CartItem[] => {
      const storedCarrinho = localStorage.getItem('carrinho');
      if (!storedCarrinho) return [];
      return JSON.parse(storedCarrinho);
  };
  
  export const adicionarAoCarrinho = (produto: {
      id: number;
      nome: string;
      preco: number;
      imagem: string;
  }): CartItem[] => {
      const carrinho = getCarrinhoItems();
      const itemExistente = carrinho.find(item => item.id === produto.id);
      
      if (itemExistente) {
          itemExistente.qtd += 1;
      } else {
          carrinho.push({
              ...produto,
              qtd: 1
          });
      }
      
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      return carrinho;
  };
  
  export const removerDoCarrinho = (id: number): CartItem[] => {
      let carrinho = getCarrinhoItems();
      carrinho = carrinho.filter(item => item.id !== id);
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
      return carrinho;
  };
  
  export const aumentarQuantidade = (id: number): CartItem[] => {
      const carrinho = getCarrinhoItems();
      const item = carrinho.find(item => item.id === id);
      if (item) {
          item.qtd += 1;
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
      }
      return carrinho;
  };
  
  export const diminuirQuantidade = (id: number): CartItem[] => {
      const carrinho = getCarrinhoItems();
      const item = carrinho.find(item => item.id === id);
      if (item) {
          item.qtd -= 1;
          if (item.qtd <= 0) {
              return removerDoCarrinho(id);
          }
          localStorage.setItem('carrinho', JSON.stringify(carrinho));
      }
      return carrinho;
  };
  
  export const calcularSubtotal = (): number => {
      const carrinho = getCarrinhoItems();
      return carrinho.reduce((total, item) => total + (item.preco * item.qtd), 0);
  };
  
  export const limparCarrinho = (): void => {
      localStorage.setItem('carrinho', JSON.stringify([]));
  };
