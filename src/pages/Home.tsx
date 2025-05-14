import React, { useEffect } from 'react';
import styled from 'styled-components';
import { listarProdutos } from '../services/axiosServices';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;


const Hero = styled.div`
  background: black;
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  text-align: center;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #532b3d, #200f0f, #a72f2f, #532b3d, #200f0f, #a72f2f, #532b3d);
    background-size: 600% 100%;
    animation: gradientFlow 60s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
  
  @keyframes gradientFlow {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 0%;
    }
    75% {
      background-position: 200% 0%;
    }
    100% {
      background-position: 300% 0%;
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;

  h3 {
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 1.25rem;
    font-weight: bold;
    color: #A23F3F;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #fbbf24;
    margin: 0.5rem 0;
  }
`;

export function Home() {
  const [produtos, setProdutos] = React.useState<any[]>([]);
  const [size] = React.useState(9);
  const [currentPage] = React.useState(0);
  const navigate = useNavigate();

  const fetchProdutos = async (page: number) => {
    try {
      const response = await listarProdutos(page, size);
      setProdutos(response.content);
    } catch (error) {
      console.error('Error listing products:', error);
    }
  };

  useEffect(() => {
    fetchProdutos(currentPage);
  }, [currentPage]);

  const handleDetalhesClick = (id: number) => {
    navigate(`/produto/${id}`);
  };

  const produtosAtivos = produtos.filter((produto) => produto.ativo);

  return (
    <>
      <Hero>
        <h1>Bem-vindo à MVP Locker</h1>
      </Hero>
      <Container>
        <ProductGrid>
          {produtosAtivos.map((produto) => {
            const imagemPrincipal = produto.imagemPrincipal?.conteudo
              ? `data:image/jpeg;base64,${produto.imagemPrincipal.conteudo}`
              : null;

            return (
              <ProductCard key={produto.id} onClick={() => handleDetalhesClick(produto.id)}>
                <img src={imagemPrincipal || 'https://placehold.co/250x250/4D3741/white'} alt={produto.nomeProduto} />
                <ProductInfo>
                  <h3>{produto.nomeProduto}</h3>
                  <div className="price">R${produto.preco.toFixed(2)}</div>
                </ProductInfo>
              </ProductCard>
            );
          })}
        </ProductGrid>
      </Container>
    </>
  );
}