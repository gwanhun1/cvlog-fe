import React, { useState, ReactNode, useRef, useEffect } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position,
  delay = 100,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsVisible(false), 100);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const getPositionStyles = () => {
    if (!tooltipRef.current || !containerRef.current) return {};

    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(8px)',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(-8px)',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%) translateX(8px)',
        };
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-8px)',
        };
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return {
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        };
      case 'bottom':
        return {
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderLeft: '1px solid #e2e8f0',
          borderTop: '1px solid #e2e8f0',
        };
      case 'left':
        return {
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
          borderRight: '1px solid #e2e8f0',
          borderTop: '1px solid #e2e8f0',
        };
      case 'right':
        return {
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
          borderLeft: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        };
      default:
        return {
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
        };
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="w-80 absolute top-10 z-50 px-3 py-2  text-sm text-gray-700 bg-white rounded shadow-md whitespace-pre-line"
          style={getPositionStyles()}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
