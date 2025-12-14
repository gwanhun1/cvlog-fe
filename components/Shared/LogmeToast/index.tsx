import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
} from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconClass = 'w-6 h-6';
  switch (type) {
    case 'success':
      return <FiCheckCircle className={`text-green-500 ${iconClass}`} />;
    case 'error':
      return <FiXCircle className={`text-red-500 ${iconClass}`} />;
    case 'warning':
      return <FiAlertTriangle className={`text-amber-500 ${iconClass}`} />;
    case 'info':
      return <FiInfo className={`text-blue-500 ${iconClass}`} />;
  }
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-white border-2 border-green-400 text-green-700',
  error: 'bg-white border-2 border-red-400 text-red-700',
  warning: 'bg-white border-2 border-amber-400 text-amber-700',
  info: 'bg-white border-2 border-blue-400 text-blue-700',
};

interface ToastProviderProps {
  children: ReactNode;
}

interface ConfirmState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const showConfirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) => {
      setConfirm({
        isOpen: true,
        message,
        onConfirm: () => {
          onConfirm();
          setConfirm(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          onCancel?.();
          setConfirm(prev => ({ ...prev, isOpen: false }));
        },
      });
    },
    []
  );

  const handleConfirm = () => {
    confirm.onConfirm();
  };

  const handleCancel = () => {
    confirm.onCancel();
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast 알림 - 중앙 상단 */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto"
            >
              <div
                className={`flex items-center gap-4 px-7 py-6 rounded-3xl ${
                  toastStyles[toast.type]
                } shadow-xl shadow-gray-300/50 min-w-[360px] max-w-[520px]`}
              >
                <ToastIcon type={toast.type} />
                <p className="flex-1 text-lg font-semibold leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm 모달 */}
      <AnimatePresence>
        {confirm.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative p-6 mx-4 w-full max-w-sm bg-white rounded-3xl border shadow-2xl border-ftBlue/20"
              onClick={e => e.stopPropagation()}
            >
              {/* 배경 장식 */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br to-transparent rounded-full blur-2xl from-ftBlue/20" />

              <div className="relative space-y-5">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ftBlue to-[#1c3f7a] flex items-center justify-center shadow-md shadow-ftBlue/30">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-bold text-ftBlue">확인</h3>
                </div>

                <p className="text-base leading-relaxed text-ftGray">
                  {confirm.message}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 text-sm font-semibold bg-white rounded-xl border-2 border-gray-200 transition-colors text-ftGray hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-ftBlue to-[#1c3f7a] hover:from-[#1c3f7a] hover:to-ftBlue shadow-md shadow-ftBlue/30 transition-all"
                  >
                    확인
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
