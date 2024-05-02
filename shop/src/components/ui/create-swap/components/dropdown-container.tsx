import React, { useState, useRef, useEffect } from 'react';
import UpIcon from '@/components/icons/up-icon';
import DownIcon from '@/components/icons/down-icon';

interface DropdownProps {
  label: string;
  items: string[];
  onItemSelect?: (item: string) => void;
  className?: string;
  inputClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  dropdownClassName?: string;
  includeOther?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  items,
  onItemSelect,
  className = '',
  inputClassName = '',
  itemClassName = '',
  labelClassName = '',
  dropdownClassName = '',
  includeOther = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = items.filter((item) =>
      typeof item === 'string' && item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (includeOther && !filtered.includes("Other")) {
      filtered = [...filtered, "Other"];
    }
  
    setFilteredItems(filtered);
  
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, searchTerm, items]);

  const handleItemClick = (item: string) => {
    setSearchTerm(item); // Consider resetting the searchTerm if you want the input to reflect the selected item
    setIsOpen(false);
    onItemSelect?.(item);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <label className={`${labelClassName}`}>{label}</label>
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`w-full ${inputClassName}`}
        />
        <button 
          onClick={toggleDropdown} 
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {isOpen ? <UpIcon /> : <DownIcon />}
        </button>
      </div>
      {isOpen && (
        <div
          className={`absolute z-10 mt-1 w-full overflow-auto shadow-md max-h-60 ${dropdownClassName}`}
        >
          {filteredItems.map((item) => (
            <div
              key={item}
              onClick={() => handleItemClick(item)}
              className={`${itemClassName} cursor-pointer`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;