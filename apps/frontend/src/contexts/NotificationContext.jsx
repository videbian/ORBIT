import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
    toasts
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Container de toasts */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

