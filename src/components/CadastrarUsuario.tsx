import React, { useState } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import { cadastrarUsuario } from '../services/axiosServices';
import { Button } from './Button';
const CadastrarUsuario: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [role, setRole] = useState('STOCKIST');
    const [errorMessage, setErrorMessage] = useState('');

    const validateInputs = () => {
        if (name.length < 3) {
            toast.error('O nome deve ter pelo menos 3 caracteres.');
            setErrorMessage('O nome deve ter pelo menos 3 caracteres.');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Por favor, insira um e-mail válido.');
            setErrorMessage('Por favor, insira um e-mail válido.');
            return false;
        }
        if (cpf.length !== 14) {
            toast.error('Por favor, insira um CPF válido.');
            setErrorMessage('Por favor, insira um CPF válido.');
            return false;
        }
        if (password.length < 1) {
            toast.error('A senha deve ter pelo menos 1 caractere.');
            setErrorMessage('A senha deve ter pelo menos 1 caractere.');
            return false;
        }
        if (password !== passwordConfirm) {
            toast.error('As senhas não coincidem.');
            setErrorMessage('As senhas não coincidem.');
            return false;
        }
        return true;
    };
    const applyCpfMask = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateInputs()) return;
        const data = {
            name,
            email,
            cpf,
            senha: password,
            tipo: role,
        };
        console.log(data);

        try {
            await cadastrarUsuario(data);
            toast.success('Usuário cadastrado com sucesso!');
            setErrorMessage('');
            onSuccess();
            setName('');
            setEmail('');
            setCpf('');
            setPassword('');
            setPasswordConfirm('');
            setRole(role);
        } catch (error: any) {
            if (error.response?.data === 'Email já cadastrado') {
                toast.error('Email já cadastrado.');
            } else if (error.response?.data === 'Erro ao salvar usuário: Erro ao cadastrar usuário: CPF já cadastrado') {
                toast.error('CPF já cadastrado.');
            } else {
                toast.error('Erro ao cadastrar usuário.');
            }
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label htmlFor="name">Nome</Label>
                <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                    type="text"
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(applyCpfMask(e.target.value))}
                    required
                    placeholder="000.000.000-00"
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="password">Senha</Label>
                <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
                <Input
                    type="password"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label htmlFor="role">Cargo</Label>
                <Select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="STOCKIST">Estoquista</option>
                    <option value="ADMIN">Administrador</option>
                </Select>
            </FormGroup>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

            <Button type="submit" style={{ marginTop: '1rem' }}>
                Cadastrar
            </Button>
            <ToastContainer />
        </Form>
    );
};
export default CadastrarUsuario;
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

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;
