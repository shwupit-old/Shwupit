import React, { useState, useContext } from 'react';
import { CurrencyContext } from './src/contexts/currency-context';

const ItemPrice: React.FC = () => {
  const [price, setPrice] = useState('');
  const { currencySymbol } = useContext(CurrencyContext);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  return (
    <div className="flex items-center w-full">
      <span className="text-gray-700 bg-white p-2">{currencySymbol}</span>
      <input
        type="text"
        value={price}
        onChange={handlePriceChange}
        className="flex-1 py-2 px-3 text-sm text-gray-700 bg-white border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-400"
        style={{ paddingLeft: `${currencySymbol.length + 1}ch` }} 
      />
    </div>
  );
};

export default ItemPrice;