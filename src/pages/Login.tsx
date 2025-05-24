import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { authUser } from '../services/axiosServices';

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
  max-width: 400px;
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
    border-color: #2563eb;
  }
`;

const SignUpLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;

  a {
    color: #2563eb;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export function Login() {
  const navigate = useNavigate();
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const dataUser = {
      email,
      senha: password
    };

    try {
      console.log(dataUser);
      const response = await authUser(dataUser);
      const userData = { ...response, tipo: response.role };
      delete userData.role;
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      window.location.reload();
    } catch (error: any) {
      setErrorMessage(error.response.data);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailErrorMessage('Por favor insira um e-mail válido.');
      isValid = false;
    } else {
      setEmailErrorMessage('Erro ao fazer login.');
    }

    if (!password.value || password.value.length < 1) {
      setPasswordErrorMessage('A senha deve ter no mínimo 1 caracteres.');
      isValid = false;
    } else {
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Container>
      <FormCard>
        <Title>Entrar</Title>
        {(errorMessage || passwordErrorMessage || emailErrorMessage) && (
          <p style={{ color: 'red', textAlign: 'center' }}>
            {errorMessage || passwordErrorMessage || emailErrorMessage}
          </p>
        )}
        <Form onSubmit={handleSubmit}>
          <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Senha" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth>
            Entrar
          </Button>
        </Form>
        <SignUpLink>
          Não tem uma conta?{' '}
          <Button variant="link" to="/cadastrar" onClick={validateInputs}>
            Cadastrar-se
          </Button>
        </SignUpLink>
      </FormCard>
    </Container>
  );
}
