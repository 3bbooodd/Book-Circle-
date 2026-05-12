import { useState } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {object} - Returns { toasts, showToast } object
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = '') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, msg, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}
