'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FullPageSpinner } from '@/app/components/spinners';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  message: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading');

  const setLoading = useCallback((loading: boolean, msg?: string) => {
    setIsLoading(loading);
    if (msg) {
      setMessage(msg);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, message }}>
      {children}
      {isLoading && <FullPageSpinner message={message} />}
    </LoadingContext.Provider>
  );
};
