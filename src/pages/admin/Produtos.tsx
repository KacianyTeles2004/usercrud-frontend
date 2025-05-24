import styled from 'styled-components';
import { Button } from '../../components/Button';
import { PackagePlus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { listarProdutos, statusProduto } from '../../services/axiosServices';
import ModalProdutos from '../../components/ModalProdutos';
import CadastrarProduto from '../../components/CadastrarProduto';
import { DropdownMenu } from '../../components/DropdownMenu';
import EditarProdutos from '../../components/EditarProdutos';

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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  button {
    background-color: #A23F3F;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    cursor: pointer;
    border-radius: 0.25rem;

    &:disabled {
      background-color: #d1d5db;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #4D3741;
    }
  }

  span {
    margin: 0 1rem;
    color: #374151;
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

export function Produtos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);
  const [ModalProdutosOpen, setModalProdutosOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [produtoParaConfirmar, setProdutoParaConfirmar] = useState<Produto | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  /*const navigate = useNavigate();*/
   // Verificar o tipo do usuário no localStorage
   const userJson = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userJson);
  const isEstoquista = user.tipo === 'STOCKIST';

  interface Produto {
    id: number;
    nomeProduto: string;
    avaliacao: number;
    descricao: string;
    preco: number;
    quantEstoque: number;
    ativo: boolean;
    imagens: Array<{
      id: number;
      url: string;
      imagemPrincipal: boolean;
      conteudo: string;
    }>
  }

  const handleOpenModal = (produto: Produto) => {
    if (isEstoquista) return; // Bloqueia o acesso ao modal para estoquistas
    setProdutoSelecionado(produto);
    setModalProdutosOpen(true);
  };

  const handleCloseModal = () => {
    setModalProdutosOpen(false);
    setProdutoSelecionado(null);
  };

  const openConfirmModal = (produto: Produto) => {
    setProdutoParaConfirmar(produto);
    setIsOpen(true);
  }

  const closeConfirmModal = () => {
    setProdutoParaConfirmar(null);
    setIsOpen(false);
  }

  const openEditModal = (produto: Produto) => {
    setProdutoParaEditar(produto);
    setEditOpen(true);
  }

  /*const closeEditModal = () => {
    setProdutoParaEditar(null);
    setEditOpen(false);
  }*/

  const handleToggleActive = async () => {
    if (isEstoquista) return; // Bloqueia a ação para estoquistas
    if (!produtoParaConfirmar) return;

    try {
      console.log('Alterando status do produto:', produtoParaConfirmar.id);
      await statusProduto(produtoParaConfirmar.id);
      fetchProdutos(currentPage);
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
    }
  };

  const fetchProdutos = async (page: number) => {
    try {
      const response = await listarProdutos(page, size);
      setProdutos(response.content);
      console.log(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error listing products:', error);
    }
  };

  useEffect(() => {
    fetchProdutos(currentPage);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredProducts = searchTerm
    ? produtos.filter((produto) =>
      produto.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : produtos;

  return (
    <div>
      <PageHeader>
        <Title>Produtos</Title>
        <SearchBar>
          <Search size={24} />
          <input
            type="text"
            placeholder="Pesquisar por produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        {/* Exibir botão apenas para administradores */}
        {!isEstoquista && (
          <Button onClick={() => setIsModalOpen(true)}>
            <PackagePlus size={20} />
            Adicionar Produto
          </Button>
        )}
      </PageHeader>

      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Preço</Th>
            <Th>Estoque</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((produto) => (
            <tr key={produto.id}>
              <Td>{produto.nomeProduto}</Td>
              <Td>R${produto.preco.toFixed(2)}</Td>
              <Td>{produto.quantEstoque}</Td>
              <Td style={{ color: produto.ativo ? '#10B981' : '#EF4444' }}>{produto.ativo ? 'Ativo' : 'Inativo'}</Td>
              <Td>
                <DropdownMenu
                  options={[
                    {
                      label: 'Editar',
                      onClick: () => openEditModal(produto),
                    },
                    {
                      label: produto.ativo ? 'Desativar' : 'Ativar',
                      onClick: () => openConfirmModal(produto),
                    },
                    {
                      label: 'Visualizar',
                      onClick: () => handleOpenModal(produto),
                    },
                  ]}
                />
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {produtoSelecionado && (
        <ModalProdutos
          isOpen={ModalProdutosOpen}
          onClose={handleCloseModal}
          images={produtoSelecionado.imagens.map((imagem) => `data:image/jpeg;base64,${imagem.conteudo}`)}
          nome={produtoSelecionado.nomeProduto}
          avaliacao={produtoSelecionado.avaliacao.toString()}
          descricao={produtoSelecionado.descricao}
          preco={produtoSelecionado.preco.toString()}
          quantidadeEstoque={produtoSelecionado.quantEstoque.toString()}
        />
      )}
      <Modal
        isOpen={modalIsOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmar mudança"
      >
        <p>
          Tem certeza que deseja {produtoParaConfirmar?.ativo ? 'desativar' : 'ativar'} o produto{' '}
          <strong>{produtoParaConfirmar?.nomeProduto}</strong>?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <Button onClick={handleToggleActive}>Confirmar</Button>
          <Button onClick={closeConfirmModal}>Cancelar</Button>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Novo Produto">
        <CadastrarProduto />
      </Modal>
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Editar Produto">
        {produtoParaEditar && <EditarProdutos 
          produtoId={produtoParaEditar.id} 
          onClose={() => setEditOpen(false)}  // Adicione esta linha
        />}
      </Modal>
      <Pagination>
        <button onClick={prevPage} disabled={currentPage === 0}>
          Anterior
        </button>
        <span>
          Página {currentPage + 1} de {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
          Próxima
        </button>
      </Pagination>
    </div>
  );
}
