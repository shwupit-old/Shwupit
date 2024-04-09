import React, { useState, useEffect } from 'react';
import Dropdown from './components/dropdown-container'; 
import countryCityDataJson from './src/data/countries-and-cities.json';

interface CountryCityData {
    [country: string]: string[];
  }
  const countryCityData: CountryCityData = countryCityDataJson as CountryCityData;
  
  const ItemLocation: React.FC = () => {
      const [selectedCountry, setSelectedCountry] = useState<string>('');
      const [filteredCities, setFilteredCities] = useState<string[]>([]);
    
      useEffect(() => {
        const cities = countryCityData[selectedCountry];
        if (cities) {
          setFilteredCities(cities);
        } else {
          setFilteredCities([]);
        }
      }, [selectedCountry]);

      const dropdownStylingProps = {
        className: "w-full",
        inputClassName: "w-full py-2 px-3 text-sm bg-white focus:ring-0 border border-gray-200 rounded-base",
        itemClassName: "px-3 py-2 hover:bg-gray-300 hover:text-white cursor-pointer",
        labelClassName: "block text-base font-semibold text-black",
        dropdownClassName: "bg-white shadow-md max-h-60 rounded-base",
      };
  
      return (
        <div className="flex flex-col gap-1">
          <Dropdown
            label="Country"
            items={Object.keys(countryCityData)}
            onItemSelect={setSelectedCountry}
            {...dropdownStylingProps}
          />
          <span className="text-xs text-gray-600">Select the country from where you're shipping.</span>
  
          <Dropdown
            label="City"
            items={filteredCities}
            onItemSelect={(selectedCity) => console.log('City Selected:', selectedCity)}
            {...dropdownStylingProps}
          />
          <span className="text-xs text-gray-600">Choose the city for a more precise shipping location.</span>
        </div>
      );
  };
  
  export default ItemLocation;