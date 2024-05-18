import React, { useState } from 'react';
import currencySymbolsData from './src/data/currencysymbols.json';

// Define a type for the currency object
type CurrencyInfo = {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
};

// Define the type for the currency symbols object with an index signature
type CurrencySymbols = {
  [key: string]: CurrencyInfo;
};

// Correctly type the imported JSON
const currencySymbols: CurrencySymbols = currencySymbolsData;

const ItemPrice: React.FC<{ currency?: string }> = ({ currency = 'USD' }) => {
  const [price, setPrice] = useState('');

  // Get the native symbol for the given currency code
  const currencyInfo = currencySymbols[currency];
  const currencySymbol = currencyInfo ? currencyInfo.symbol_native : currency;

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };


  const symbolLength = currencySymbol.length;  // Calculate padding based on the length of the currency symbol
  const paddingLeft = `${symbolLength * 0.9 + 0.8}rem`; // Adjust the multiplier and addition as needed

  return (
    <div className="flex items-center w-full relative">
      <span className="absolute left-0 pl-4 mt-1 flex items-center pointer-events-none text-gray-700 border-2 border-transparent"
        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
      >
        {currencySymbol}
      </span>
      <input
        type="text"
        value={price}
        onChange={handlePriceChange}
        className="text-sm text-gray-700 bg-white border-2 border-gray-200 focus:ring-0 ring-blue-500 w-1/3"
        style={{ height: '40px', lineHeight: '40px', paddingLeft }} 
        placeholder=""
      />
    </div>
  );
};

export default ItemPrice;