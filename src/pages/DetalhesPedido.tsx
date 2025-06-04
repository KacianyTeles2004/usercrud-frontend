import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  descricao?: string;
  imagem?: string;
}

const categorias = ['Todos', 'Bebidas', 'Lanches', 'Doces'];

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

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProductCard = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  background: #f3f3f3;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const ProductCategory = styled.p`
  margin: 0 0 0.5rem 0;
  color: #888;
`;

const ProductPrice = styled.p`
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  color: #A23F3F;
`;

const ProductDescription = styled.p`
  margin: 0;
  color: #555;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #888;
  margin-top: 2rem;
`;

const Loading = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const API_URL = 'http://localhost:3001/produtos'; 
const TelaProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filtro, setFiltro] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      setCarregando(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        setProdutos([]);
      } finally {
        setCarregando(false);
      }
    };
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter(produto => {
    const nomeMatch = produto.nome.toLowerCase().includes(filtro.toLowerCase());
    const categoriaMatch = categoriaSelecionada === 'Todos' || produto.categoria === categoriaSelecionada;
    return nomeMatch && categoriaMatch;
  });

  return (
    <Container>
      <Title>Produtos</Title>
      <FilterBar>
        <Input
          type="text"
          placeholder="Filtrar produto..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
        <label htmlFor="categoria-select" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 500 }}>Categoria:</span>
          <Select
            id="categoria-select"
            value={categoriaSelecionada}
            onChange={e => setCategoriaSelecionada(e.target.value)}
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </label>
      </FilterBar>
      {carregando ? (
        <Loading>Carregando produtos...</Loading>
      ) : produtosFiltrados.length === 0 ? (
        <EmptyState>Nenhum produto encontrado.</EmptyState>
      ) : (
        <ProductList>
          {produtosFiltrados.map(produto => (
            <ProductCard key={produto.id}>
              <ProductImage src={produto.imagem || 'https://placehold.co/100'} alt={produto.nome} />
              <ProductInfo>
                <ProductName>{produto.nome}</ProductName>
                <ProductCategory>{produto.categoria}</ProductCategory>
                <ProductPrice>R$ {produto.preco.toFixed(2)}</ProductPrice>
                {produto.descricao && (
                  <ProductDescription>{produto.descricao}</ProductDescription>
                )}
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductList>
      )}
    </Container>
  );
};

export default TelaProdutos;