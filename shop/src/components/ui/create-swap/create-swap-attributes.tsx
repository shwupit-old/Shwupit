import React, { useState, useRef, useEffect } from 'react';

const categories = ['Electronics', 'Clothing', 'Books', 'Sports'];
const brands = ['Nike', 'Adidas', 'Sony', 'Apple'];

interface DropdownProps {
    label: string;
    items: string[];
    borderColor: string;
    borderRadius: string;
    textColor: string;
  }

const Dropdown: React.FC<DropdownProps> = ({
    label,
    items,
    borderColor,
    borderRadius,
    textColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(items[0]);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        const pageClickEvent = (e: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setIsOpen(false);
          }
        };
    
        if (isOpen) {
          window.addEventListener('click', pageClickEvent);
        }
    
        return () => {
          window.removeEventListener('click', pageClickEvent);
        };
      }, [isOpen]);
    
      return (
        <div className="flex-1 relative" ref={dropdownRef}>
          <label className={`block mb-1 text-base font-semibold ${textColor}`}>
            {label}
          </label>
          <div className={`${borderColor} ${borderRadius}`}> {/* Border applied here */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full text-left py-2 px-3 text-sm ${textColor} bg-white`}
            >
              {selectedItem}
            </button>
          </div>
          {isOpen && (
            <div
              className={`absolute z-10 mt-1 left-0 right-0 overflow-auto bg-white ${borderRadius} shadow-md`}
            >
              {items.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 hover:bg-gray-700 hover:text-white cursor-pointer ${textColor}`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };
    

    interface ItemAttributesProps {
        borderColor: string;
        borderRadius: string;
        textColor: string;
        borderThickness: string; 
        inputBackground: string;
      }
      const ItemAttributes: React.FC<ItemAttributesProps> = ({
        borderColor = 'border-2 border-gray-200', 
        borderRadius = 'rounded-lg',
        textColor = 'text-black',
        borderThickness,
        inputBackground
      }) => {
        // The props for the Dropdown components inside ItemAttributes should match the interface.
        return (
          <div className="flex gap-4 mb-6">
            <Dropdown
              label="Category"
              items={categories}
              borderColor={borderColor}
              borderRadius={borderRadius}
              textColor={textColor}
            />
            <Dropdown
              label="Brand"
              items={brands}
              borderColor={borderColor}
              borderRadius={borderRadius}
              textColor={textColor}
            />
          </div>
        );
      };
      
      export default ItemAttributes;