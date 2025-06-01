'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
  startPageTransition: () => void;
  endPageTransition: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setPageTransitioning] = useState(false);
  
  const setLoading = (state: boolean) => {
    setIsLoading(state);
  };

  const startPageTransition = () => {
    setIsLoading(true);
    setPageTransitioning(true);
  };

  const endPageTransition = () => {
    setPageTransitioning(false);

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
        setPageTransitioning(false);
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);
  
  const contextValue = {
    isLoading,
    setLoading,
    startPageTransition,
    endPageTransition
  };
  
  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
