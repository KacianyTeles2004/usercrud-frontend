
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { editarProduto, listarProdutoPorId, updateImagens } from '../services/axiosServices';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from './Button';

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
    conteudo?: string; // Adicionei o campo conteudo aqui
  }>
}

interface Usuario {
  id: number;
  tipo: string;
}

interface EditarProdutosProps {
  produtoId: number;
  onClose: () => void; // pra fechar o modal
}

const EditarProdutos: React.FC<EditarProdutosProps> = ({ produtoId, onClose }) => {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        if (produtoId) {
          const produtoData = await listarProdutoPorId(produtoId); // Chama a função para buscar o produto
          setProduto(produtoData); // Atualiza o estado com os dados do produto
        }
        const usuarioData = localStorage.getItem('user');
        if (usuarioData) {
          const usuarioParse = JSON.parse(usuarioData);
          console.log(usuarioData) // Faz o parsing do JSON
          setUsuario(usuarioParse); // Atualiza o estado com os dados do usuário
        }
      } catch (error) {
        console.error('Erro ao buscar o produto ou usuário:', error);
      }
    };
    fetchProduto();
  }, [produtoId]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!produto) return;
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: name === 'quantidade' ? parseInt(value) : value });
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!produto) return;

    const file = e.target.files?.[0]; // Obtém o primeiro arquivo selecionado
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1]; // Obtém o conteúdo base64 da imagem
      if (base64) {
        const newImage = {
          id: 0,
          url: '', // A URL será gerada no backend
          conteudo: base64, // Conteúdo da imagem em base64
          imagemPrincipal: false,
        };

        // Atualiza o estado do produto com a nova imagem
        setProduto((prevProduto) => ({
          ...prevProduto!,
          imagens: [...prevProduto!.imagens, newImage],
        }));
      }
    };
    reader.readAsDataURL(file);
  };


  const handleImageChange = (id: number, isPrincipal: boolean) => {
    if (!produto) return;

    const updatedImages = produto.imagens.map((imagem) =>
      imagem.id === id
        ? { ...imagem, imagemPrincipal: isPrincipal }
        : { ...imagem, imagemPrincipal: false } // Garante que apenas uma imagem seja principal
    );

    setProduto({ ...produto, imagens: updatedImages });
  };

  const handleRemoveImage = (id: number) => {
    if (!produto) return;
    const updatedImages = produto.imagens.filter((imagem) => imagem.id !== id);
    setProduto({ ...produto, imagens: updatedImages });
  };


  const salvarAlteracoes = async () => {
    if (!produto || !usuario) return;

    try {
      // 1. Enviar os dados do produto
      const produtoAtualizado = {
        id: produto.id,
        nomeProduto: produto.nomeProduto,
        descricao: produto.descricao,
        preco: produto.preco,
        quantEstoque: produto.quantEstoque,
        ativo: produto.ativo,
        avaliacao: produto.avaliacao,
      };

      await editarProduto(usuario.id, produtoAtualizado);

      // 2. Preparar as imagens para envio
      const formData = new FormData();

      // Adicionar IDs das imagens existentes
      produto.imagens.forEach(imagem => {
        formData.append('ids', String(imagem.id || 0));
      });

      // Adicionar URLs
      produto.imagens.forEach(imagem => {
        formData.append('urls', imagem.url || '');
      });

      // Adicionar flags de imagem principal
      produto.imagens.forEach(imagem => {
        formData.append('principais', String(imagem.imagemPrincipal));
      });

      // Adicionar arquivos de imagem
      for (let i = 0; i < produto.imagens.length; i++) {
        const imagem = produto.imagens[i];

        if (imagem.conteudo) {
          // Converter base64 para Blob corretamente
          const byteString = atob(imagem.conteudo);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);

          for (let j = 0; j < byteString.length; j++) {
            ia[j] = byteString.charCodeAt(j);
          }

          const blob = new Blob([ab], { type: 'image/jpeg' });
          const file = new File([blob], `imagem-${Date.now()}.jpg`, { type: 'image/jpeg' });
          formData.append('imagens', file);
        } else {
          // Para imagens existentes, adicionar um arquivo vazio
          formData.append('imagens', new Blob(), '');
        }
      }

      // 3. Enviar as imagens para o backend
      await updateImagens(produto.id, formData);
      toast.success('Produto e imagens atualizados com sucesso!');
      setTimeout(() => {
        navigate('/produtos');
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    }
  };

  if (!produto || !usuario) {
    return <Loading>Carregando...</Loading>;
  }

  return (
    <Card>
      <Formulario>
        <Campo>
          <Label>ID:</Label>
          <Input
            type="number"
            name="id"
            value={produto.id}
            onChange={handleInputChange}
            disabled={true}
          />
        </Campo>
        <Campo>
          <Label>Nome:</Label>
          <Input
            type="text"
            name="nomeProduto"
            value={produto.nomeProduto}
            onChange={handleInputChange}
            disabled={usuario.tipo !== 'ADMIN'}
          />
        </Campo>
        <Campo>
          <Label>Descrição:</Label>
          <Input
            type="text"
            name="descricao"
            value={produto.descricao}
            onChange={handleInputChange}
            disabled={usuario.tipo !== 'ADMIN'}
          />
        </Campo>
        <Campo>
          <Label>Preço:</Label>
          <Input
            type="number"
            name="preco"
            value={produto.preco}
            onChange={handleInputChange}
            disabled={usuario.tipo !== 'ADMIN'}
          />
        </Campo>
        <Campo>
          <Label>Quantidade:</Label>
          <Input
            type="number"
            name="quantEstoque"
            value={produto.quantEstoque}
            onChange={handleInputChange}
          />
        </Campo>
        <ImagensContainer>
          <Label>Imagens:</Label>
          {produto.imagens.map((imagem) => (
            <ImagemItem key={imagem.id || imagem.conteudo}>
              {/* Renderiza a imagem no formato base64 */}
              <Imagem
                src={`data:image/jpeg;base64,${imagem.conteudo}`}
                alt={`Imagem ${imagem.id || 'nova'}`}
              />
              <div>
                <Status>
                  {imagem.imagemPrincipal ? 'Imagem Principal' : 'Imagem Secundária'}
                </Status>
                <Button
                  type="button"
                  onClick={() => handleImageChange(imagem.id || 0, !imagem.imagemPrincipal)}
                >
                  {imagem.imagemPrincipal
                    ? 'Remover como Principal'
                    : 'Definir como Principal'}
                </Button>
                <Button type="button" onClick={() => handleRemoveImage(imagem.id || 0)}>
                  Remover
                </Button>
              </div>
            </ImagemItem>
          ))}
          <Campo>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload} // Chama a função ao selecionar um arquivo
            />
          </Campo>
        </ImagensContainer>
          <Button type="button" onClick={salvarAlteracoes}>
            Salvar
          </Button>
          <Button 
            type="button" 
            onClick={onClose}
            style={{ backgroundColor: '#666'}}
          >
            Cancelar
          </Button>
      </Formulario>
      <ToastContainer />
    </Card>
  );
};

export default EditarProdutos;

// // ...existing code...
// const BotoesContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 10px;
// `;
// // ...existing code...

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 8px;
`;

const Status = styled.span`
    font-size: 12px;
    font-weight: bold;
    color: #4CAF50;
    margin-right: 10px;
  `;

const ImagensContainer = styled.div`
    margin-top: 20px;
  `;

const ImagemItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  `;

const Imagem = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  `;

const Formulario = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
  `;

const Campo = styled.div`
    display: flex;
    flex-direction: column;
  `;

const Label = styled.label`
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #111827;
  `;

const Input = styled.input`
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #111827;

    &:disabled {
      cursor: not-allowed;
    }
  `;

const Loading = styled.div`
    text-align: center;
    font-size: 18px;
    color: #4B5563; 
  `;
