
import * as React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { cadastrarProduto, uploadImagens } from '../services/axiosServices';
import { Button } from './Button';
export default function CadastrarProduto() {
  const [avaliacao, setAvaliacao] = React.useState('');
  const [nome, setNome] = React.useState('');
  const [descricao, setDescricao] = React.useState('');
  const [preco, setPreco] = React.useState('');
  const [quantEstoque, setQuantEstoque] = React.useState('');
  const [imagens, setImagens] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [imagemPrincipalIndex, setImagemPrincipalIndex] = React.useState<number | null>(null);
  const handleSetImagemPrincipal = (index: number) => {
    setImagemPrincipalIndex(index);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImagens([...imagens, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
    }
  };
  const handleRemoveImage = (index: number) => {
    const updatedImages = imagens.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagens(updatedImages);
    setImagePreviews(updatedPreviews);
  };
  const validateInputs = () => {
    if (!avaliacao || !nome || !descricao || !preco || !quantEstoque || imagens.length === 0) {
      setErrorMessage('Todos os campos são obrigatórios, incluindo pelo menos uma imagem.');
      return false;
    }
    setErrorMessage('');
    return true;
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;
    const produtoData = {
      nomeProduto: nome,
      descricao: descricao,
      avaliacao: avaliacao.replace(',', '.'),
      preco: preco.replace(',', '.'),
      quantEstoque: quantEstoque,
    };
    try {
      const response = await cadastrarProduto(produtoData);
      const produtoId = response.id;
      const formData = new FormData();
      imagens.forEach((file, index) => {
        formData.append('imagens', file);
        formData.append('principais', String(index === imagemPrincipalIndex));
      });
      await uploadImagens(produtoId, formData);
      toast.success('Produto cadastrado com sucesso!');
      setSuccessMessage('Produto e imagens cadastrados com sucesso!');
      setErrorMessage('');
      setNome('');
      setDescricao('');
      setAvaliacao('');
      setPreco('');
      setQuantEstoque('');
      setImagens([]);
      setImagePreviews([]);
    } catch (error: any) {
      console.error('Erro ao cadastrar produto ou imagens:', error.response?.data);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data ||
        'Erro ao cadastrar produto ou imagens. Tente novamente mais tarde.';
      setErrorMessage(errorMessage);
      setSuccessMessage('');
    } finally {
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };
  return (
    <Card>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1rem' }}>
        Cadastrar Produto
      </h1>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Nome do Produto</FormLabel>
          <TextField
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Avaliação</FormLabel>
          <TextField
            required
            value={avaliacao}
            onChange={(e) => setAvaliacao(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Descrição</FormLabel>
          <TextArea
            required
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Preço</FormLabel>
          <TextField
            required
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Quantidade em Estoque</FormLabel>
          <TextField
            required
            value={quantEstoque}
            onChange={(e) => setQuantEstoque(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Imagens do Produto</FormLabel>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </FormControl>
        {imagePreviews.map((preview, index) => (
          <ImagePreview key={index}>
            <img src={preview} alt={`Imagem ${index + 1}`} />
            <button
              type="button"
              onClick={() => handleSetImagemPrincipal(index)}
              style={{
                backgroundColor: imagemPrincipalIndex === index ? 'green' : 'gray',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              {imagemPrincipalIndex === index ? 'Principal' : 'Marcar como Principal'}
            </button>
            <button type="button" onClick={() => handleRemoveImage(index)}>
              Remover
            </button>
          </ImagePreview>
        ))}
        <Button type="submit" variant="primary">
          Cadastrar
        </Button>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </Form>
      <ToastContainer />
    </Card>
  );
}
const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 8px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const FormControl = styled.div`
  display: flex;
  flex-direction: column;
`;
const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;
const TextField = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 8px;
  &:focus {
    outline: none;
    border-color: #A23F3F;
    box-shadow: 0 0 0 1px #A23F3F;
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 8px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #A23F3F;
    box-shadow: 0 0 0 1px #A23F3F;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
  button {
    margin-top: 0.5rem;
  }
`;
const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;
const SuccessMessage = styled.p`
  color: green;
  text-align: center;
`;
// çeefç.e