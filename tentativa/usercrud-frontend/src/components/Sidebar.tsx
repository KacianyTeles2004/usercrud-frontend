import styled from 'styled-components';
import { Users, Package } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SidebarContainer = styled.aside`
  width: 250px;
  background: white;
  height: calc(100vh - 72px);
  border-right: 1px solid #e5e7eb;
  padding: 2rem 1rem;
`;
const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #4b5563;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
  &:hover {
    background: #f3f4f6;
  }
  &.active {
    background: #A23F3F;
    color: white;
  }
`;

export function Sidebar() {
  const [userTipo, setUserTipo] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserTipo(user.tipo || null);
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      setUserTipo(null);
    }
  }, []);

  return (
    <SidebarContainer>
      {userTipo === 'ADMIN' && (
      <NavItem to="/admin/usuarios">
        <Users size={20} />
        Usuários
      </NavItem>
      )}
      <NavItem to="/admin/produtos">
        <Package size={20} />
        Produtos
      </NavItem>
    </SidebarContainer>
  );
}
