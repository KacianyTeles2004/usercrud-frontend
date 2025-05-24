import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';

const AdminContainer = styled.div`
  display: flex;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`;

export function AdminLayout() {
  return (
    <AdminContainer>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </AdminContainer>
  );
}