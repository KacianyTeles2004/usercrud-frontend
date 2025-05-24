import styled, { css, keyframes } from 'styled-components';
import { ButtonProps, ButtonSize, ButtonVariant } from './types';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${spin} 1s linear infinite;
`;

const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    small: css`
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    `,
    medium: css`
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    `,
    large: css`
      padding: 1rem 2rem;
      font-size: 1.125rem;
    `,
  };
  return sizes[size];
};

const getVariantStyles = (variant: ButtonVariant) => {
  const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
    primary: css`
      background: #A23F3F;
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background: #4D3741;
      }
    `,
    secondary: css`
      background: #f3f4f6;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      
      &:hover:not(:disabled) {
        background: #e5e7eb;
      }
    `,
    danger: css`
      background: #dc2626;
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background: #b91c1c;
      }
    `,
    success: css`
      background: #059669;
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background: #047857;
      }
    `,
    ghost: css`
      background: transparent;
      color: #2563eb;
      border: none;
      
      &:hover:not(:disabled) {
        background: #f3f4f6;
      }
    `,
    link: css`
      background: transparent;
      color: #A23F3F;
      padding: 0;
      border: none;
      text-decoration: none;
      
      &:hover:not(:disabled) {
        text-decoration: underline;
      }
    `,
    outline: css`  // Add this new variant
      background: transparent;
      color: #A23F3F;
      border: 1px solid #A23F3F;
      
      &:hover:not(:disabled) {
        background: rgba(162, 63, 63, 0.1);
      }
    `,
  };

  return variants[variant] || variants.primary;
};

const ButtonContainer = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $fullWidth: ButtonProps['fullWidth'];
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  ${props => getSizeStyles(props.$size || 'medium')}
  ${props => getVariantStyles(props.$variant || 'primary')}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

export { ButtonContainer, LoaderWrapper };