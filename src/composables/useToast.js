import { toast } from 'vue-sonner';

const defaultOptions = {
  duration: 2000,
  rtl: true,
  position: 'bottom-left',
};

export function useToast() {
  const showSuccess = (message, description = null, options = {}) => {
    toast.success(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  const showError = (message, description = null, options = {}) => {
    toast.error(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  const showWarning = (message, description = null, options = {}) => {
    toast.warning(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  const showInfo = (message, description = null, options = {}) => {
    toast.info(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
