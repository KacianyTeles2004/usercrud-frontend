import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #A23F3F;
  }
`;

const FormSection = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 1rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    height: 2px;
    width: 40px;
    background-color: #A23F3F;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  
  a {
    color: #A23F3F;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CepRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem;
  background: #A23F3F;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #4D3741;
  }
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-left: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export function Cadastro() {
  const navigate = useNavigate();
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Estado para os dados de endereço
  const [address, setAddress] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/login');
  };
  
  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async () => {
    if (!address.cep || address.cep.length < 8) {
      alert("Por favor, insira um CEP válido");
      return;
    }
    
    // Remove caracteres não numéricos
    const cleanCep = address.cep.replace(/\D/g, '');
    
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();
      
      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }
      
      setAddress({
        ...address,
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      });
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Ocorreu um erro ao buscar o CEP");
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Criar uma conta</Title>
        <Form onSubmit={handleSubmit}>
          {/* Dados pessoais */}
          <FormSection>
            <SectionTitle>Dados Pessoais</SectionTitle>
            <Input 
              type="text" 
              placeholder="Nome Completo" 
              required 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              required 
            />
            <FormRow>
              <Input 
                type="password" 
                placeholder="Senha" 
                required 
              />
              <Input 
                type="password" 
                placeholder="Confirmar Senha" 
                required 
              />
            </FormRow>
          </FormSection>
          
          {/* Endereço */}
          <FormSection>
            <SectionTitle>Endereço</SectionTitle>
            <CepRow>
              <Input 
                type="text" 
                placeholder="CEP" 
                value={address.cep}
                onChange={(e) => setAddress({...address, cep: e.target.value})}
                required 
              />
              <SearchButton 
                type="button" 
                onClick={fetchAddressByCep}
              >
                Buscar CEP
                {isLoadingCep && <LoadingSpinner />}
              </SearchButton>
            </CepRow>
            
            <Input 
              type="text" 
              placeholder="Logradouro" 
              value={address.logradouro}
              onChange={(e) => setAddress({...address, logradouro: e.target.value})}
              required 
            />
            
            <FormRow>
              <Input 
                type="text" 
                placeholder="Número" 
                value={address.numero}
                onChange={(e) => setAddress({...address, numero: e.target.value})}
                required 
              />
              <Input 
                type="text" 
                placeholder="Complemento" 
                value={address.complemento}
                onChange={(e) => setAddress({...address, complemento: e.target.value})}
              />
            </FormRow>
            
            <Input 
              type="text" 
              placeholder="Bairro" 
              value={address.bairro}
              onChange={(e) => setAddress({...address, bairro: e.target.value})}
              required 
            />
            
            <FormRow>
              <Input 
                type="text" 
                placeholder="Cidade" 
                value={address.cidade}
                onChange={(e) => setAddress({...address, cidade: e.target.value})}
                required 
              />
              <Input 
                type="text" 
                placeholder="Estado" 
                value={address.estado}
                onChange={(e) => setAddress({...address, estado: e.target.value})}
                required 
              />
            </FormRow>
          </FormSection>
          
          <Button type="submit" fullWidth>
            Cadastrar-se
          </Button>
        </Form>
        
        <LoginLink>
          Já tem uma conta?{' '}
          <Button variant="link" to="/login">
            Entrar
          </Button>
        </LoginLink>
      </FormCard>
    </Container>
  );
}