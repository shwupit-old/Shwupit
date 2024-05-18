import React, { useState, useEffect } from 'react';
import Dropdown from './components/dropdown-container';
import axios from 'axios';

interface ItemLocationProps {
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const ItemLocation: React.FC<ItemLocationProps> = ({ setCurrency }) => {
  const [countries, setCountries] = useState<{ country: string, cities: string[], iso2: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>(''); // New state to handle city input

  useEffect(() => {
    axios.get('https://countriesnow.space/api/v0.1/countries/')
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setCountries(response.data.data.map(item => ({
            country: item.country,
            cities: item.cities,
            iso2: item.iso2  // Assuming the response has iso2
          })));
          console.log('Countries loaded:', response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching countries', error);
      });
  }, []);

  useEffect(() => {
    // Clear city input when selected country changes
    setCityInput('');

    const countryData = countries.find(c => c.country === selectedCountry);
    if (countryData && countryData.iso2) {
      setFilteredCities(countryData.cities);
      console.log('Selected country ISO2:', countryData.iso2);
      fetchCurrency(countryData.iso2);
    } else {
      setFilteredCities([]);
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

  const dropdownStylingProps = {
    className: "w-full",
    inputClassName: "w-full py-2 px-3 text-sm bg-white focus:ring-0 border border-gray-200 rounded-base border-2",
    itemClassName: "px-3 py-2 hover:bg-gray-300 hover:text-white cursor-pointer",
    labelClassName: "block text-base font-semibold text-black ",
    dropdownClassName: "bg-white shadow-md max-h-60 rounded-base",
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-row gap-3">
        <div className="flex-1">
          <Dropdown
            label="Country"
            items={countries.map(country => country.country)}
            onItemSelect={setSelectedCountry}
            {...dropdownStylingProps}
          />
          <span className="text-xs text-gray-600">Select the country from where you're shipping.</span>
        </div>
        <div className="flex-1">
          <Dropdown
            label="City"
            items={filteredCities}
            onItemSelect={(selectedCity) => console.log('City Selected:', selectedCity)}
            inputValue={cityInput} // Add inputValue prop to set the input field value
            onInputChange={setCityInput} // Add onInputChange prop to handle input changes
            {...dropdownStylingProps}
          />
          <span className="text-xs text-gray-600">Choose the city for a more precise shipping location.</span>
        </div>
      </div>
    </div>
  );
};

export default ItemLocation;