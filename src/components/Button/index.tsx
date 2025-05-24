import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ButtonContainer, LoaderWrapper } from './styles';
import { ButtonProps, ButtonVariant, ButtonSize } from './types';

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  isLoading = false,
  to,
  type = 'button',
  onClick,
  className,
  ...props
}: ButtonProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (to) {
      navigate(to);
    }
    onClick?.(e);
  };

  return (
    <ButtonContainer
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {isLoading ? (
        <LoaderWrapper>
          <Loader2 size={16} />
        </LoaderWrapper>
      ) : children}
    </ButtonContainer>
  );
}

export type { ButtonProps, ButtonVariant, ButtonSize };
