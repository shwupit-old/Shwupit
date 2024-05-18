import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ItemImageSection } from './create-item-image';
import popularItems from './src/data/popular-items.json';
import ItemCategories from './create-item-categories';
import ItemLocation from './create-item-location';
import ItemPrice from './create-item-price';

const ItemDetailsSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'border-gray-600' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-700';
  const hintTextColor = isDark ? 'text-gray-400' : 'text-gray-500'; // Lighter text color for hints
  const borderThickness = 'border-2';
  const backgroundColor = isDark ? 'bg-transparent' : 'bg-white';
  const inputBackground = isDark ? 'bg-transparent' : 'bg-white';
  const borderRadius = 'rounded-base';
  const fixedHeightForTextArea = 'h-32 overflow-auto';
  const [currentIndex, setCurrentIndex] = useState(0);
  const charLimit = 800;
  const [description, setDescription] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [currency, setCurrency] = useState('');
  // Function to cycle through the items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (currentIndex) => (currentIndex + 1) % popularItems.length,
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const text = event.target.value;
    if (text.length <= charLimit) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  return (
    <div className={`min-h-screen ${backgroundColor} pt-8`}>
      <div className="space-y-6 mx-auto px-4 sm:px-0 sm:w-3/5">
        {/* Name Field */}
        <div>
          <label
            htmlFor="itemName"
            className={`block mb-1 ${textColor} text-base font-semibold`}
          >
            Name
          </label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            className={`block w-full ${borderColor} ${borderThickness} ${inputBackground} ${borderRadius} py-3 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-gray-400`}
            placeholder={popularItems[currentIndex].name}
          />
          <span className={`block mt-1 text-xs font-regular ${hintTextColor}`}>
            Descriptive name for better search visibility
          </span>
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="itemDescription"
            className={`block mb-1 ${textColor} text-base font-semibold`}
          >
            Description
          </label>
          <textarea
            id="itemDescription"
            name="itemDescription"
            rows={5}
            value={description}
            onChange={handleDescriptionChange}
            className={`block w-full ${borderColor} ${borderThickness} ${inputBackground} ${borderRadius} py-3 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-gray-400`}
            placeholder={popularItems[currentIndex].description}
          ></textarea>
          <div className="flex justify-between">
            <span className={`text-xs mt-1 font-regular ${hintTextColor}`}>
              Condition, size, and intentions to attract the right swap
            </span>
            <span
              className={`text-xs font-regular ${
                charCount >= charLimit ? 'text-red-500' : hintTextColor
              }`}
            >
              {charCount}/{charLimit}
            </span>
          </div>
        </div>

        {/* Image Section */}
        <div>
          <label
            htmlFor="itemImage"
            className={`block mb-1 ${textColor} text-base font-semibold`}
          >
            Photos
          </label>
          <ItemImageSection />
          <span className={`block mt-0 text-xs font-regular ${hintTextColor}`}>
            Add up to 6 photos in JPEG or PNG format
          </span>

          <div className="mt-6">
            <ItemCategories
              borderColor="border-2 border-gray-200"
              borderRadius="rounded-base"
              textColor="text-black"
              borderThickness="border-1"
              inputBackground={inputBackground}
              hintTextColor={hintTextColor}
            />
          </div>
          <div className="mt-6">
            <ItemLocation setCurrency={setCurrency}/>
          </div>
          <div className="mt-6">
          <label
            htmlFor="itemPrice"
            className={`block mb-1 text-black text-base font-semibold`}
          >
            Price
          </label>
            <ItemPrice currency={currency} />
            <span className={`block mt-0 mb-6 text-xs font-regular ${hintTextColor}`}>
            Expected Swap Value
          </span>         </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsSection;
