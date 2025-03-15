import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <nav className="mt-4">
        <Link className="text-blue-500 mr-4" to="/users">Gerenciar Usuários</Link>
        <Link className="text-blue-500" to="/products">Gerenciar Produtos</Link>
      </nav>
    </div>
  );
}
