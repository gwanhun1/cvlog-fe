import React from 'react';
import { cn } from 'styles/utils';

export interface LogmeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size: 'big' | 'medium' | 'small';
  variant?: 'classic' | 'ghost' | 'error' | 'success' | 'disabled';
  fullWidth?: boolean;
}

const LogmeButton = ({
  size,
  variant = 'classic',
  disabled = false,
  children,
  className,
  style,
  onClick,
  fullWidth = false,
  ...props
}: LogmeButtonProps) => {
  const isGhost = variant === 'ghost';
  const isDisabled = disabled || variant === 'disabled';

  const baseStyles = 'font-semibold transition-all duration-300 ease-in-out transform translate-y-0 active:translate-y-[2px] flex items-center justify-center';
  
  const sizeStyles = {
    big: 'h-[54px] rounded-2xl text-[18px]',
    medium: 'h-[44px] rounded-xl text-base',
    small: 'h-[36px] rounded-lg text-base',
  };

  const widthStyles = fullWidth
    ? 'w-full'
    : size === 'big'
    ? 'w-[144px]'
    : size === 'medium'
    ? 'w-[114px]'
    : 'w-[80px]';

  const getVariantClasses = () => {
    if (isDisabled) {
      return 'bg-[#d4d7dd] text-[#788699] cursor-not-allowed opacity-60 shadow-[0_1px_2px_rgba(120,134,153,0.25)] active:shadow-none active:translate-y-0';
    }

    if (isGhost) {
      return 'bg-transparent text-[#1f4a8c] border border-[#1f4a8c] hover:bg-[#1f4a8c] hover:text-white shadow-[0_1px_2px_rgba(38,87,166,0.3)] active:shadow-[0_1px_3px_rgba(38,87,166,0.3)]';
    }

    switch (variant) {
      case 'error':
        return 'bg-[#f05252] text-white hover:bg-[#d32f2f] shadow-[0_1px_2px_rgba(208,2,27,0.5)] active:shadow-[0_1px_3px_rgba(208,2,27,0.5)] hover:shadow-[0_2px_6px_rgba(208,2,27,0.5)]';
      case 'success':
        return 'bg-[#0e9f6e] text-white hover:bg-[#0b7d56] shadow-[0_1px_2px_rgba(11,125,86,0.5)] active:shadow-[0_1px_3px_rgba(11,125,86,0.5)] hover:shadow-[0_2px_6px_rgba(11,125,86,0.5)]';
      default:
        return 'bg-[#2657A6] text-white hover:bg-[#1f4a8c] shadow-[0_1px_2px_rgba(38,87,166,0.3)] active:shadow-[0_1px_3px_rgba(38,87,166,0.3)] hover:shadow-[0_2px_6px_rgba(38,87,166,0.3)]';
    }
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        widthStyles,
        getVariantClasses(),
        className
      )}
      style={style}
      onClick={onClick}
      disabled={isDisabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default LogmeButton;
