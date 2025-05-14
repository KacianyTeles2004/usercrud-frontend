import styled from 'styled-components';
import { ArrowLeft, CreditCard, Banknote } from 'lucide-react';

export const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  color: #111827;
  margin-bottom: 2rem;
  font-weight: 600;
`;

interface PaymentOptionProps {
  selected: boolean;
}

export const PaymentOption = styled.div<PaymentOptionProps>`
  border: 1px solid ${({ selected }) => selected ? '#A23F3F' : '#e5e7eb'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ selected }) => selected ? '#f9f1f1' : 'white'};
  box-shadow: ${({ selected }) => selected ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    border-color: #A23F3F;
  }
`;

export const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

export const PaymentTitle = styled.h3`
  font-size: 1.125rem;
  color: #111827;
  margin: 0;
  font-weight: 500;
`;

export const PaymentDescription = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
`;

export const CardForm = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #e5e7eb;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
`;

interface InputProps {
  ariaInvalid?: boolean;
}

export const Input = styled.input<InputProps>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ ariaInvalid }) => ariaInvalid ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: #f9fafb;

  &:focus {
    outline: none;
    border-color: #A23F3F;
    box-shadow: 0 0 0 2px #f9f1f1;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

// Componentes para ícones
export const CreditCardIcon = styled(CreditCard)`
  color: #A23F3F;
`;

export const BanknoteIcon = styled(Banknote)`
  color: #A23F3F;
`;

export const ArrowLeftIcon = styled(ArrowLeft)`
  margin-right: 0.5rem;
`;