import React, { useState, useEffect } from 'react';
import Dropdown from './components/dropdown-container'; // Ensure this path matches your file structure
import Categories from './src/data/categories.json';
import Subcategory from './src/data/subcategories.json';

const categories = Categories.categories.sort();
const subcategoryData: { [category: string]: string[] } = Subcategory;

interface ItemCategoriesProps {
  borderColor: string;
  borderRadius: string;
  textColor: string;
  hintTextColor: string;
  borderThickness: string;
  inputBackground: string;
}

const ItemCategories: React.FC<ItemCategoriesProps> = ({
  borderColor,
  borderRadius,
  textColor,
  hintTextColor,
  borderThickness,
  inputBackground,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredSubcategory, setFilteredSubcategory] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      // Dynamically set subcategories based on the selected category
      const categoriesSubcategories = subcategoryData[selectedCategory] || [];
      setFilteredSubcategory(categoriesSubcategories);
    } else {
      // Reset subcategories if no category is selected
      setFilteredSubcategory([]);
    }
  }, [selectedCategory]);

  const dropdownCommonProps = {
    borderColor: borderColor,
    borderRadius: borderRadius,
    textColor: textColor,
    hintTextColor: hintTextColor,
    className: 'flex-1',
    labelClassName: `block mb-1 text-base font-semibold ${textColor}`,
    inputClassName: `w-full py-2 px-3 text-sm ${textColor} ${inputBackground} ${borderRadius} focus:ring-0 ${borderColor} ${borderThickness}`,
    itemClassName: `px-3 py-2 hover:bg-gray-300 hover:text-white cursor-pointer ${textColor}`,
    dropdownClassName: `absolute z-10 mt-1 left-0 right-0 w-full overflow-auto bg-white shadow-md max-h-60 ${borderRadius} ${borderColor}`,
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Dropdown
          label="Category"
          items={categories}
          onItemSelect={setSelectedCategory}
          {...dropdownCommonProps}
        />
        <span className={`block mt-1 text-xs ${hintTextColor}`}>Select a category for better search visibility</span>
      </div>
      <div className="flex-1">
        <Dropdown
          label="Subcategory"
          items={filteredSubcategory}
          onItemSelect={(selectedSubcategory) => console.log('Subcategory Selected:', selectedSubcategory)}
          {...dropdownCommonProps}
        />
        <span className={`block mt-1 text-xs ${hintTextColor}`}>Select a subcategory for more specific classification</span>
      </div>
    </div>
  );
};

export default ItemCategories;