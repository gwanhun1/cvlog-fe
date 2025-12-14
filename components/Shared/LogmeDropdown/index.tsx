import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DropdownHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

// 메인 Dropdown 컴포넌트
export const LogmeDropdown = ({
  trigger,
  children,
  align = 'right',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClass = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="inline-block relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`overflow-hidden absolute top-full z-50 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl ${alignmentClass[align]} min-w-[200px]`}
          >
            <div onClick={() => setIsOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Dropdown Header
export const DropdownHeader = ({
  children,
  className = '',
}: DropdownHeaderProps) => {
  return (
    <div
      className={`px-4 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

// Dropdown Item
export const DropdownItem = ({
  children,
  onClick,
  className = '',
  danger = false,
}: DropdownItemProps) => {
  const baseClass =
    'w-full px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center';
  const colorClass = danger
    ? 'text-red-600 hover:bg-red-50'
    : 'text-gray-700 hover:bg-gray-50 hover:text-ftBlue';

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${colorClass} ${className}`}
    >
      {children}
    </div>
  );
};

// Dropdown Divider
export const DropdownDivider = () => {
  return <div className="border-t border-gray-100" />;
};

export default LogmeDropdown;
