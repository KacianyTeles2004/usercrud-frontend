import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { cadastrarUsuario } from '../services/axiosServices';

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


// 2. TIPAGEM - Tipos mais completos e organizados
interface EnderecoUsuario {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface DadosCadastro {
  nomeCompleto: string;
  email: string;
  cpf: string;
  genero: string; 
  dataNascimento: string; 
  senha: string;
  confirmacaoSenha: string;
  enderecoFaturamento: EnderecoUsuario;
  enderecosEntrega?: EnderecoUsuario[];
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// 3. COMPONENTE PRINCIPAL
export function Cadastro() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Estado único para todos os dados do formulário
  const [formData, setFormData] = useState<DadosCadastro>({
    nomeCompleto: '',
    email: '',
    cpf: '',
    genero: '', 
    dataNascimento: '', // Inicializando o campo de data de nascimento
    senha: '',
    confirmacaoSenha: '',
    enderecoFaturamento: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    enderecosEntrega: [
      {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
    ]
  });

  // 4. MANIPULAÇÃO DE CEP - Busca automática ao digitar CEP completo
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');

    setFormData({
      ...formData,
      enderecoFaturamento: {
        ...formData.enderecoFaturamento,
        cep: e.target.value
      }
    });

    // Busca automática quando CEP está completo
    if (cep.length === 8) {
      await buscarEnderecoPorCep(cep);
    }
  };

  // 5. FUNÇÃO DE BUSCA DE CEP - Separada para melhor organização
  const buscarEnderecoPorCep = async (cep: string) => {
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      setFormData({
        ...formData,
        enderecoFaturamento: {
          ...formData.enderecoFaturamento,
          cep: data.cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf
        }
      });
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert(error instanceof Error ? error.message : "Erro ao buscar endereço");
    } finally {
      setIsLoadingCep(false);
    }
  };

  // 6. MANIPULADOR GENÉRICO DE CAMPO - Para inputs normais
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in formData.enderecoFaturamento) {
      setFormData({
        ...formData,
        enderecoFaturamento: {
          ...formData.enderecoFaturamento,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // 7. VALIDAÇÃO DE FORMULÁRIO - Centralizada
  const validarFormulario = (): boolean => {
    // Valida senhas iguais
    if (formData.senha !== formData.confirmacaoSenha) {
      alert('As senhas não coincidem!');
      return false;
    }

    // Valida campos obrigatórios
    const camposObrigatorios = [
      formData.nomeCompleto,
      formData.email,
      formData.senha,
      formData.confirmacaoSenha,
      formData.cpf,
      formData.genero,
      formData.dataNascimento,
      formData.enderecoFaturamento.cep,
      formData.enderecoFaturamento.logradouro,
      formData.enderecoFaturamento.numero,
      formData.enderecoFaturamento.bairro,
      formData.enderecoFaturamento.cidade,
      formData.enderecoFaturamento.estado
    ];

    if (camposObrigatorios.some(campo => !campo)) {
      alert('Preencha todos os campos obrigatórios!');
      return false;
    }

    return true;
  };

  // 8. SUBMISSÃO DO FORMULÁRIO - Com tratamento de erro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    // Cria uma cópia dos dados do formulário com o endereço de faturamento incluído na lista de endereços de entrega
    const dadosParaEnvio = {
      ...formData,
      enderecosEntrega: [
        { ...formData.enderecoFaturamento } // Adiciona uma cópia do endereço de faturamento como primeiro endereço de entrega
      ]
    };

    setIsLoading(true);

    try {
      const response = await cadastrarUsuario(dadosParaEnvio);

      // Salva os dados do usuário no localStorage (exceto informações sensíveis)
      const dadosUsuario = {
        id: response.data?.id,
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        cpf: formData.cpf,
        genero: formData.genero,
        dataNascimento: formData.dataNascimento,
        endereco: formData.enderecoFaturamento
      };
      
      // Salva os dados no localStorage
      localStorage.setItem('usuarioInfo', JSON.stringify(dadosUsuario));
      
      // Caso a API retorne um token de autenticação
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Verifica se a resposta foi bem-sucedida
      // Axios retorna diretamente os dados, não precisa chamar .json()
      alert('Cadastro realizado com sucesso!');
      navigate('/login'); // Modificado para redirecionar para a página de login
    } catch (error) {
      console.error('Erro no cadastro:', error);
      // Axios geralmente inclui a mensagem de erro em error.response.data
      let errorMessage = 'Erro ao processar cadastro';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 9. RENDERIZAÇÃO DO FORMULÁRIO
  return (
    <Container>
      <FormCard>
        <Title>Criar uma conta</Title>
        <Form onSubmit={handleSubmit}>
          {/* Seção de Dados Pessoais */}
          <FormSection>
            <SectionTitle>Dados Pessoais</SectionTitle>
            <Input
              type="text"
              name="nomeCompleto"
              placeholder="Nome Completo"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="genero"
              placeholder="Gênero"
              value={formData.genero}
              onChange={handleInputChange}
              required
            />
            <Input
              type="date"
              name="dataNascimento"
              placeholder="Data de Nascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormRow>
              <Input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleInputChange}
                required
              />
              <Input
                type="password"
                name="confirmacaoSenha"
                placeholder="Confirmar Senha"
                value={formData.confirmacaoSenha}
                onChange={handleInputChange}
                required
              />
            </FormRow>
          </FormSection>

          {/* Seção de Endereço */}
          <FormSection>
            <SectionTitle>Endereço</SectionTitle>
            <CepRow>
              <Input
                type="text"
                name="cep"
                placeholder="CEP"
                value={formData.enderecoFaturamento.cep}
                onChange={handleCepChange}
                required
              />
              <SearchButton
                type="button"
                onClick={() => buscarEnderecoPorCep(formData.enderecoFaturamento.cep.replace(/\D/g, ''))}
                disabled={isLoadingCep}
              >
                Buscar CEP
                {isLoadingCep && <LoadingSpinner />}
              </SearchButton>
            </CepRow>

            <Input
              type="text"
              name="logradouro"
              placeholder="Logradouro"
              value={formData.enderecoFaturamento.logradouro}
              onChange={handleInputChange}
              required
            />

            <FormRow>
              <Input
                type="text"
                name="numero"
                placeholder="Número"
                value={formData.enderecoFaturamento.numero}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="complemento"
                placeholder="Complemento"
                value={formData.enderecoFaturamento.complemento}
                onChange={handleInputChange}
              />
            </FormRow>

            <Input
              type="text"
              name="bairro"
              placeholder="Bairro"
              value={formData.enderecoFaturamento.bairro}
              onChange={handleInputChange}
              required
            />

            <FormRow>
              <Input
                type="text"
                name="cidade"
                placeholder="Cidade"
                value={formData.enderecoFaturamento.cidade}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="estado"
                placeholder="Estado"
                value={formData.enderecoFaturamento.estado}
                onChange={handleInputChange}
                required
              />
            </FormRow>
          </FormSection>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar-se'}
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
