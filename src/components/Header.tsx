
import styled from 'styled-components';
import { ShoppingCart, Home, LogOut, UserCircle, UserCog, Cog, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  FloatingPortal,
  shift,
  flip,
  offset,
} from '@floating-ui/react';
import { Button } from './Button';
const HeaderContainer = styled.header`
  background-color: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Logo = styled(Link)`
  font-family: 'Great Vibes', cursive;
  font-size: 1.8rem;
  font-weight: bold;
  color: #4D3741;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const NavIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #4b5563;
    transition: color 0.2s;
    position: relative;
    &:hover {
      color: #4D3741;
    }
    &.active {
      color: #A23F3F;
    }
  }
`;
const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  &:hover {
    color: #4D3741;
    background: #f1f5f9;
  }
`;
const UserMenu = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 200px;
  overflow: hidden;
`;
const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
`;
const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
`;
const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
  &:hover {
    background: #f1f5f9;
    color: #4D3741;
  }
`;
export function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const tipo = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    tipo,
  ]);
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserRole(user.tipo || null);
      setUserName(user.name || null);
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      setUserRole(null);
      setUserName(null);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserName(null);
    setUserRole(null);
    setIsOpen(false);
    navigate('/login');
  };
  const handleConfiguracoesClick = () => {
    setIsOpen(false);
    navigate('/configuracoes');
  };
  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          MVP Locker
        </Logo>
        <NavIcons>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <Home size={24} />
          </Link>
          <Link to="/carrinho" className={location.pathname === '/carrinho' ? 'active' : ''}>
            <ShoppingCart size={24} />
          </Link>
          {!userName && (
            <Button to="/login">
              <LogIn size={20} />
              Entrar
            </Button>
          )}
          {userName && (
            <>
              <UserButton ref={refs.setReference} {...getReferenceProps()}>
                <UserCircle size={24} />
                {userName}
              </UserButton>
              {isOpen && (
                <FloatingPortal>
                  <UserMenu ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                    <UserInfo>
                      <h3>{userName}</h3>
                    </UserInfo>
                    <MenuItems>
                      {userRole && ['ADMIN', 'STOCKIST'].includes(userRole) && (
                        <MenuItem onClick={() => { setIsOpen(false); navigate('/admin/produtos'); }}>
                          <UserCog size={18} />
                          Painel de Admin
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleConfiguracoesClick}>
                        <Cog size={18} />
                        Configurações
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogOut size={18} />
                        Sair
                      </MenuItem>
                    </MenuItems>
                  </UserMenu>
                </FloatingPortal>
              )}
            </>
          )}
        </NavIcons>
      </Nav>
    </HeaderContainer>
  );
}
