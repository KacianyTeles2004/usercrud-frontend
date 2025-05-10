import styled from 'styled-components';
import { Button } from '../../components/Button';
import { Search, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { DropdownMenu } from '../../components/DropdownMenu';
import { editarUsuario, listarUsuarios, statusUsuario } from '../../services/axiosServices';
import CadastrarUsuario from '../../components/CadastrarUsuario';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #A23F3F;
    box-shadow: 0 0 0 1px #A23F3F;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #A23F3F;
    box-shadow: 0 0 0 1px #A23F3F;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
  padding: 10px;
  width: 50%;
  border-radius: 5px;

  input {
    border: none;
    background: none;
    margin-left: 10px;
    color: #000;
    outline: none;
    width: 50%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

interface User {
  cpf: string;
  id: number;
  name: string;
  email: string;
  senha: string;
  senhaConfirmacao: string;
  tipo: string;
  ativo: boolean;
}

export function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de edição
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal de adicionar
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const loggedInUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await listarUsuarios();
        setUsers(users);
      } catch (error) {
        console.error('Error listing users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    if (selectedUser) {
      try {
        // Verifica se as senhas foram preenchidas e são iguais
        if (selectedUser.senha || selectedUser.senhaConfirmacao) {
          if (selectedUser.senha !== selectedUser.senhaConfirmacao) {
            setErrorMessage('As senhas não coincidem.');
            return;
          }
        }

        // Cria o objeto de dados do usuário
        const userData: Partial<User> = {
          name: selectedUser.name,
          email: selectedUser.email,
          cpf: selectedUser.cpf,
          tipo: selectedUser.tipo,
          ativo: selectedUser.ativo,
        };

        // Adiciona as senhas apenas se forem preenchidas
        if (selectedUser.senha) {
          userData.senha = selectedUser.senha;
        }

        // Envia os dados para o backend
        await editarUsuario(selectedUser.id, userData);
        handleCloseEditModal();

        // Atualiza a lista de usuários
        const updatedUsers = await listarUsuarios();
        setUsers(updatedUsers);
      } catch (error) {
        if ((error as any).response && (error as any).response.data) {
          setErrorMessage((error as any).response.data);
        } else {
          setErrorMessage('Erro ao editar usuário.');
        }
        console.error('Erro ao editar o usuário:', error);
      }
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await statusUsuario(user);
      const updatedUsers = await listarUsuarios();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
    }
  };

  const mapRoleToLabel = (tipo: string) => {
    switch (tipo) {
      case 'ADMIN':
        return 'Administrador';
      case 'STOCKIST':
        return 'Estoquista';
      default:
        return tipo;
    }
  };

  const filteredUsers = searchTerm
    ? users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : users;

  return (
    <div>
      <PageHeader>
        <Title>Usuários</Title>
        <SearchBar>
          <Search size={24} />
          <input
            type="text"
            placeholder="Pesquisar por usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <Button onClick={handleAddClick}>
          <UserPlus size={20} />
          Cadastrar Usuário
        </Button>
      </PageHeader>

      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Cargo</Th>
            <Th>CPF</Th>
            <Th>Situação</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td
                style={{
                  color: user.tipo === 'ADMIN' ? '#2563EB' : '#10B981',
                  fontWeight: 'bold',
                }}
              >
                {mapRoleToLabel(user.tipo)}
              </Td>
              <Td>{user.cpf}</Td>
              <Td style={{ color: user.ativo ? '#10B981' : '#EF4444' }}>
                {user.ativo ? 'Ativo' : 'Inativo'}
              </Td>
              <Td>
                <DropdownMenu
                  options={[
                    {
                      label: 'Editar',
                      onClick: () => handleEditClick(user),
                    },
                    {
                      label: 'Ativar/Desativar',
                      onClick: () => handleToggleActive(user),
                    },
                  ]}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Adicionar novo Usuário"
      >
        <CadastrarUsuario onSuccess={async () => {
          const updatedUsers = await listarUsuarios();
          setUsers(updatedUsers);
          handleCloseAddModal();
        }} />
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Usuário"
      >
        {selectedUser && (
          <Form onSubmit={(e) => e.preventDefault()}>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <FormGroup>
              <Label>Nome</Label>
              <Input
                type="text"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>CPF</Label>
              <Input
                type="cpf"
                value={selectedUser.cpf}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, cpf: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>Alterar Senha</Label>
            
              <Input
                type="password"
                placeholder="Nova senha"
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, senha: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="Confirmar senha"
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    senhaConfirmacao: e.target.value,
                  })
                }
              />
            </FormGroup>

            {selectedUser && selectedUser.id !== loggedInUserId && JSON.parse(localStorage.getItem('user') || '{}').tipo === 'ADMIN' && (
              <FormGroup>
                <Label>Cargo</Label>
                <Select
                  value={selectedUser.tipo}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, tipo: e.target.value })
                  }
                >
                  <option value="">Selecione um cargo</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="STOCKIST">Estoquista</option>
                </Select>
              </FormGroup>
            )}

            <ButtonContainer style={{ marginTop: '1rem' }}>
              <Button type="submit" onClick={handleSave}>
                Salvar
              </Button>
              <Button onClick={handleCloseEditModal}>Cancelar</Button>
            </ButtonContainer>
          </Form>
        )}
      </Modal>
    </div>
  );
}
