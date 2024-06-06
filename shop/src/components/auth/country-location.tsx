import React, { useState, useEffect } from 'react';
import Dropdown from '../ui/create-swap/components/dropdown-container';
import axios from 'axios';

interface CountryLocationProps {
  value?: string;
  onCountrySelect: (country: string) => void;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
}

const CountryLocation: React.FC<CountryLocationProps> = ({ value, onCountrySelect, setCurrency, error }) => {
  const [countries, setCountries] = useState<{ country: string, iso2: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(value || '');

  useEffect(() => {
    axios.get('https://countriesnow.space/api/v0.1/countries/')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setCountries(response.data.data.map((item: { country: any; iso2: any; }) => ({
            country: item.country,
            iso2: item.iso2  // Assuming the response has iso2
          })));
        
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching countries', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countries.find(c => c.country === selectedCountry);
      if (countryData && countryData.iso2) {
        fetchCurrency(countryData.iso2);
      }
    }
  }, [selectedCountry, countries]);

  const fetchCurrency = (iso2: string) => {
    axios.post('https://countriesnow.space/api/v0.1/countries/currency', { iso2 })
      .then(response => {
        if (response.data && response.data.data && !response.data.error) {
          setCurrency(response.data.data.currency);
        } else {
          console.error('Failed to fetch currency:', response.data.msg);
          setCurrency(''); // Reset currency if fetch fails
        }
      })
      .catch(error => {
        console.error('Error fetching currency', error);
        setCurrency(''); // Reset currency on error
      });
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    onCountrySelect(country);
  };

  const dropdownStylingProps = {
    className: "w-full z-50",
    inputClassName: "h-11 w-full appearance-none border border-light-500 bg-transparent px-4 py-2 text-16px text-dark ring-[0.5px] ring-light-500 placeholder:text-dark-900 focus:border-brand focus:ring-[0.5px] focus:ring-brand dark:border-dark-600 dark:text-light dark:ring-dark-600 dark:placeholder:text-dark-700 dark:focus:border-brand dark:focus:ring-brand md:h-12 lg:px-5 xl:h-[50px]",
    itemClassName: "px-3 py-2 hover:bg-gray-300 hover:text-white cursor-pointer",
    labelClassName: "block text-13px pb-2.5 font-normal text-dark/70 rtl:text-right dark:text-light/70",
    dropdownClassName: "bg-white shadow-md max-h-60 rounded-base ",
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className="flex-1"
        onClick={(e) => e.stopPropagation()} // Stop event propagation here
      >
        <Dropdown
          label="Country"
          items={countries.map(country => country.country)}
          inputValue={selectedCountry}
          onItemSelect={handleCountrySelect} // Pass only the necessary argument
          {...dropdownStylingProps}
        />
        {error && (
          <span role="alert" className="block pt-2 text-xs text-warning">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default CountryLocation;