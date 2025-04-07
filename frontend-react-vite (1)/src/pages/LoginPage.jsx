import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      alert('Login falhou! Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input className="block w-full mb-2 p-2 border" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="block w-full mb-2 p-2 border" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="bg-blue-500 text-white p-2 rounded w-full" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
