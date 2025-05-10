import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { buscarUsuarioPorId } from "../services/axiosServices";
import { Button } from "../components/Button";

// Styled Components
const ConfiguracoesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ConfiguracoesContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  color: #555;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 1rem;
  background: ${props => props.active ? '#A23F3F' : '#f9f1f1'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.active ? '#4D3741' : '#f0e2e2'};
  }
`;

const Panel = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const AddressCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
`;

const AddressCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AddressType = styled.h3`
  font-size: 1.1rem;
  margin: 0;
`;

const AddressActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #A23F3F;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AddressDetails = styled.div`
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
`;

const AddNewButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background: #f9f1f1;
  border: 1px dashed #e1cbcb;
  border-radius: 8px;
  color: #A23F3F;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #f0e2e2;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
  
  &:hover {
    color: #333;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #f9f1f1;
  color: #333;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #f0e2e2;
  }
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

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

// Interfaces
interface User {
  id?: number;
  name?: string;
  email?: string;
  cpf?: string;
  tipo?: string;
}

interface Address {
  id: number;
  tipo: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
}

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

// Mock data for addresses
const mockAddresses: Address[] = [
  {
    id: 1,
    tipo: "Casa",
    cep: "12345-678",
    logradouro: "Av. Senac Santo Amaro",
    numero: "123",
    complemento: "Rua 101",
    bairro: "Santo Amaro",
    cidade: "São Paulo",
    estado: "SP",
    principal: true
  },
  {
    id: 2,
    tipo: "Empresa",
    cep: "98765-432",
    logradouro: "Avenida Paulista",
    numero: "123",
    complemento: "Andar 14",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    principal: false
  }
];

const Configuracoes: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("info");
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  
  // New address state
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    tipo: "Casa",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    principal: false
  });
  
  // Loading states
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userId = parsedUser.id;
          const userData = await buscarUsuarioPorId(userId);
          setUser(userData);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    
    fetchUser();
  }, []);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação simples
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres!");
      return;
    }
    
    // Aqui seria implementada a chamada API para alterar a senha
    alert("Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    if (!cep || cep.length < 8) return;
    
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();
      
      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }
      
      setNewAddress({
        ...newAddress,
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
  
  // Função para adicionar um novo endereço
  const handleAddAddress = () => {
    // Validação
    if (!newAddress.cep || !newAddress.logradouro || !newAddress.numero || !newAddress.cidade || !newAddress.estado) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    // Se for o primeiro endereço ou for marcado como principal, definir como principal
    const makeAddressPrimary = newAddress.principal || addresses.length === 0;
    
    // Se o endereço novo for principal, torna todos os outros não-principal
    let updatedAddresses = [...addresses];
    if (makeAddressPrimary) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        principal: false
      }));
    }
    
    // Adiciona o novo endereço
    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    updatedAddresses.push({
      ...newAddress as Address,
      id: newId,
      principal: makeAddressPrimary
    });
    
    setAddresses(updatedAddresses);
    setShowModal(false);
    resetNewAddress();
  };
  
  // Função para definir um endereço como principal
  const handleSetPrimaryAddress = (id: number) => {
    const updatedAddresses = addresses.map(address => ({
      ...address,
      principal: address.id === id
    }));
    
    setAddresses(updatedAddresses);
  };
  
  // Função para excluir um endereço
  const handleDeleteAddress = (id: number) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    
    // Confirmação
    if (!window.confirm(`Tem certeza que deseja excluir este endereço?`)) {
      return;
    }
    
    let updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    // Se o endereço excluído era o principal e ainda há outros endereços, 
    // defina o primeiro da lista como principal
    if (addressToDelete?.principal && updatedAddresses.length > 0) {
      updatedAddresses = [
        { ...updatedAddresses[0], principal: true },
        ...updatedAddresses.slice(1)
      ];
    }
    
    setAddresses(updatedAddresses);
  };
  
  // Reseta o estado do novo endereço
  const resetNewAddress = () => {
    setNewAddress({
      tipo: "Casa",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      principal: false
    });
  };

  return (
    <ConfiguracoesContainer>
      <ConfiguracoesContent>
        {user && (
          <UserInfo>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>
        )}
        
        <TabsContainer>
          <TabButton 
            active={activeTab === "info"} 
            onClick={() => setActiveTab("info")}
          >
            Informações Pessoais
          </TabButton>
          <TabButton 
            active={activeTab === "addresses"} 
            onClick={() => setActiveTab("addresses")}
          >
            Endereços de Entrega
          </TabButton>
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")}
          >
            Senhas e Privacidade
          </TabButton>
        </TabsContainer>
        
        {activeTab === "info" && (
          <Panel>
            <InputGroup>
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                type="text" 
                value={user?.name || ""} 
                onChange={(e) => setUser({...user!, name: e.target.value})}
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ""} 
                disabled 
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="cpf">CPF</Label>
              <Input 
                id="cpf" 
                type="text" 
                value={user?.cpf || ""} 
                disabled 
              />
            </InputGroup>
            <Button>Salvar Alterações</Button>
          </Panel>
        )}
        
        {activeTab === "addresses" && (
          <Panel>
            {addresses.map((address) => (
              <AddressCard key={address.id}>
                <AddressCardHeader>
                  <AddressType>
                    {address.tipo}
                    {address.principal && <Badge>Principal</Badge>}
                  </AddressType>
                  <AddressActions>
                    {!address.principal && (
                      <ActionButton onClick={() => handleSetPrimaryAddress(address.id)}>
                        Definir como Principal
                      </ActionButton>
                    )}
                    <ActionButton onClick={() => handleDeleteAddress(address.id)}>
                      Excluir
                    </ActionButton>
                  </AddressActions>
                </AddressCardHeader>
                <AddressDetails>
                  <p>{address.logradouro}, {address.numero} {address.complemento && `- ${address.complemento}`}</p>
                  <p>{address.bairro}, {address.cidade} - {address.estado}</p>
                  <p>CEP: {address.cep}</p>
                </AddressDetails>
              </AddressCard>
            ))}
            <AddNewButton onClick={() => setShowModal(true)}>
              + Adicionar Novo Endereço
            </AddNewButton>
          </Panel>
        )}
        
        {activeTab === "security" && (
          <Panel>
            <form onSubmit={handleChangePassword}>
              <InputGroup>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </InputGroup>
              <Button type="submit">Alterar Senha</Button>
            </form>
          </Panel>
        )}
      </ConfiguracoesContent>
      
      {/* Modal de Adicionar Endereço */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Adicionar Novo Endereço</ModalTitle>
              <CloseButton onClick={() => {
                setShowModal(false);
                resetNewAddress();
              }}>×</CloseButton>
            </ModalHeader>
            
            <InputGroup>
              <Label htmlFor="tipo">Tipo de Endereço</Label>
              <Input 
                id="tipo" 
                type="text" 
                placeholder="Casa, Trabalho, etc."
                value={newAddress.tipo || ""}
                onChange={(e) => setNewAddress({...newAddress, tipo: e.target.value})}
              />
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="cep">CEP</Label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Input 
                  id="cep" 
                  type="text" 
                  placeholder="00000-000"
                  value={newAddress.cep || ""}
                  onChange={(e) => setNewAddress({...newAddress, cep: e.target.value})}
                />
                <Button 
                  type="button" 
                  onClick={() => fetchAddressByCep(newAddress.cep || "")}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Buscar CEP
                  {isLoadingCep && <LoadingSpinner />}
                </Button>
              </div>
            </InputGroup>
            
            <InputGroup>
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input 
                id="logradouro" 
                type="text" 
                placeholder="Rua, Avenida, etc."
                value={newAddress.logradouro || ""}
                onChange={(e) => setNewAddress({...newAddress, logradouro: e.target.value})}
              />
            </InputGroup>
            
            <FormRow>
              <InputGroup>
                <Label htmlFor="numero">Número</Label>
                <Input 
                  id="numero" 
                  type="text" 
                  placeholder="123"
                  value={newAddress.numero || ""}
                  onChange={(e) => setNewAddress({...newAddress, numero: e.target.value})}
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="complemento">Complemento</Label>
                <Input 
                  id="complemento" 
                  type="text" 
                  placeholder="Apto, Sala, etc."
                  value={newAddress.complemento || ""}
                  onChange={(e) => setNewAddress({...newAddress, complemento: e.target.value})}
                />
              </InputGroup>
            </FormRow>
            
            <InputGroup>
              <Label htmlFor="bairro">Bairro</Label>
              <Input 
                id="bairro" 
                type="text" 
                placeholder="Centro, Jardim, etc."
                value={newAddress.bairro || ""}
                onChange={(e) => setNewAddress({...newAddress, bairro: e.target.value})}
              />
            </InputGroup>
            
            <FormRow>
              <InputGroup>
                <Label htmlFor="cidade">Cidade</Label>
                <Input 
                  id="cidade" 
                  type="text" 
                  placeholder="São Paulo"
                  value={newAddress.cidade || ""}
                  onChange={(e) => setNewAddress({...newAddress, cidade: e.target.value})}
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="estado">Estado</Label>
                <Input 
                  id="estado" 
                  type="text" 
                  placeholder="SP"
                  value={newAddress.estado || ""}
                  onChange={(e) => setNewAddress({...newAddress, estado: e.target.value})}
                />
              </InputGroup>
            </FormRow>
            
            <InputGroup>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input 
                  id="principal" 
                  type="checkbox" 
                  checked={newAddress.principal}
                  onChange={(e) => setNewAddress({...newAddress, principal: e.target.checked})}
                  style={{ width: 'auto', marginRight: '0.5rem' }}
                />
                <Label htmlFor="principal" style={{ margin: 0 }}>Definir como endereço principal</Label>
              </div>
            </InputGroup>
            
            <FormActions>
              <CancelButton 
                type="button" 
                onClick={() => {
                  setShowModal(false);
                  resetNewAddress();
                }}
              >
                Cancelar
              </CancelButton>
              <Button 
                type="button" 
                onClick={handleAddAddress}
              >
                Adicionar Endereço
              </Button>
            </FormActions>
          </ModalContent>
        </Modal>
      )}
    </ConfiguracoesContainer>
  );
};

export default Configuracoes;