import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

const ToastContainer = ({ toasts, onRemove }) => (
  <div
    style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: '360px',
      width: '100%',
    }}
    aria-live="polite"
  >
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`alert alert-${toast.type} alert-dismissible mb-0 shadow-sm`}
        role="alert"
      >
        {toast.message}
        <button
          type="button"
          className="btn-close"
          onClick={() => onRemove(toast.id)}
          aria-label="Close"
        />
      </div>
    ))}
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export default ToastContext;
