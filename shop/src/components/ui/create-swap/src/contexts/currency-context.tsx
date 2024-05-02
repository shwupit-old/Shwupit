import React, { createContext, useState, ReactNode } from 'react';

interface CurrencyContextState {
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
}

const defaultState: CurrencyContextState = {
  currencySymbol: '',
  setCurrencySymbol: () => {}
};


export const CurrencyContext = createContext<CurrencyContextState>(defaultState);


interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currencySymbol, setCurrencySymbol] = useState<string>('');

  return (
    <CurrencyContext.Provider value={{ currencySymbol, setCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};