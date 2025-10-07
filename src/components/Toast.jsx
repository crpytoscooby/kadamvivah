import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast - Simple toast notification component
 * 
 * Types: success, error, info
 * Auto-dismisses after 5 seconds
 */

export const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[type]} animate-in slide-in-from-right`}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast container hook for managing multiple toasts
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};
