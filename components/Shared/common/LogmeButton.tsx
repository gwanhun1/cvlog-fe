import React from 'react';
import { styled } from 'styled-components';

interface BaseButtonProps {
  size: 'big' | 'medium' | 'small';
  variant: 'classic' | 'ghost' | 'error' | 'success' | 'disabled';
}

const getColor = (variant: string) => {
  switch (variant) {
    case 'error':
      return {
        bg: '#f05252',
        border: '#d32f2f',
        text: '#ffffff',
        shadow: 'rgba(208, 2, 27, 0.5)',
      };
    case 'success':
      return {
        bg: '#0e9f6e',
        border: '#0b7d56',
        text: '#ffffff',
        shadow: 'rgba(11, 125, 86, 0.5)',
      };
    case 'disabled':
      return {
        bg: '#6b7280',
        border: '#4b5563',
        text: '#ffffff',
        shadow: 'rgba(107, 114, 128, 0.3)',
      };
    default:
      return {
        bg: '#1a56db',
        border: '#174ab3',
        text: '#ffffff',
        shadow: 'rgba(26, 86, 219, 0.5)',
      };
  }
};

const BaseButton = styled.button<BaseButtonProps>`
  width: ${({ size }) =>
    size === 'big' ? '144px' : size === 'medium' ? '114px' : '80px'};
  height: ${({ size }) =>
    size === 'big' ? '54px' : size === 'medium' ? '44px' : '36px'};
  border-radius: ${({ size }) =>
    size === 'big' ? '16px' : size === 'medium' ? '12px' : '8px'};
  font-size: ${({ size }) => (size === 'big' ? '18px' : '16px')};
  font-weight: 600;
  cursor: ${({ variant }) =>
    variant === 'disabled' ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease-in-out;
  opacity: ${({ variant }) => (variant === 'disabled' ? '0.6' : '1')};
  box-shadow: 0px 1px 2px ${({ variant }) => getColor(variant).shadow};
  transform: translateY(0);
  &:active {
    box-shadow: 0px 1px 3px ${({ variant }) => getColor(variant).shadow};
    transform: translateY(2px);
  }
`;

const ClassicButton = styled(BaseButton)`
  background-color: ${({ variant }) => getColor(variant).bg};
  color: ${({ variant }) => getColor(variant).text};
  border: none;
  &:hover {
    background-color: ${({ variant }) => getColor(variant).border};
    box-shadow: 0px 2px 6px ${({ variant }) => getColor(variant).shadow};
  }
`;

const GhostButton = styled(BaseButton)`
  background-color: transparent;
  color: ${({ variant }) => getColor(variant).border};
  border: 1px solid ${({ variant }) => getColor(variant).border};
  &:hover {
    background-color: ${({ variant }) => getColor(variant).border};
    color: ${({ variant }) => getColor(variant).text};
  }
`;

export interface LogmeButtonProps {
  size: 'big' | 'medium' | 'small';
  variant?: 'classic' | 'ghost' | 'error' | 'success' | 'disabled';
  disabled?: boolean; // 추가
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const LogmeButton = ({
  size,
  variant = 'classic',
  disabled = false, // 기본값 false
  children,
  className,
  style,
  onClick,
}: LogmeButtonProps) => {
  const buttonProps = {
    size,
    variant,
    className,
    style,
    onClick,
    disabled: disabled || variant === 'disabled', // 사용자가 직접 설정 가능
  };

  return variant === 'ghost' ? (
    <GhostButton {...buttonProps}>{children}</GhostButton>
  ) : (
    <ClassicButton {...buttonProps}>{children}</ClassicButton>
  );
};

export default LogmeButton;
