import type { Component } from 'vue';
import { toast } from 'vue-sonner';

type Position =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center';

interface ToastOptions {
  duration?: number;
  rtl?: boolean;
  position?: Position;
  description?: string | Component | (() => string | Component);
  [key: string]: any;
}

const defaultOptions: ToastOptions = {
  duration: 2000,
  rtl: true,
  position: 'bottom-left',
};

export function useToast() {
  const showSuccess = (
    message: string,
    description?: string | Component | (() => string | Component),
    options: ToastOptions = {}
  ) => {
    toast.success(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  const showError = (
    message: string,
    description?: string | Component | (() => string | Component),
    options: ToastOptions = {}
  ) => {
    toast.error(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  const showWarning = (
    message: string,
    description?: string | Component | (() => string | Component),
    options: ToastOptions = {}
  ) => {
    toast.warning(message, {
      ...defaultOptions,
      description,
      ...options,
    });
  };

  const showInfo = (
    message: string,
    description?: string | Component | (() => string | Component),
    options: ToastOptions = {}
  ) => {
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
