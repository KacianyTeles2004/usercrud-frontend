import React, { useState } from 'react';
import styled from 'styled-components';
import { MoreHorizontal } from 'lucide-react';

interface DropdownMenuProps {
  options: { label: string; onClick: () => void }[];
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <DropdownContainer>
      <DropdownButton onClick={toggleDropdown}>
        <MoreHorizontal size={20} />
      </DropdownButton>
      {isOpen && (
        <DropdownList>
          {options.map((option, index) => (
            <DropdownItem key={index} onClick={() => {
              option.onClick();
              setIsOpen(false);
            }}>
              {option.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
  min-width: 150px;
`;

const DropdownItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;

  &:hover {
    background: #f3f4f6;
  }
`;