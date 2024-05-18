import React, { useState, useRef, useEffect } from 'react';
import UpIcon from '@/components/icons/up-icon';
import DownIcon from '@/components/icons/down-icon';
import CheckIcon from '@/components/icons/check-icon';

interface DropdownProps {
  label: string;
  items: string[];
  onItemSelect?: (item: string) => void;
  inputValue?: string;
  onInputChange?: (input: string) => void;
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
  inputValue,
  onInputChange,
  className = '',
  inputClassName = '',
  itemClassName = '',
  labelClassName = '',
  dropdownClassName = '',
  includeOther = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(inputValue || '');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(inputValue || '');
  }, [inputValue]);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setSearchTerm(item);
    setIsOpen(false);
    onItemSelect?.(item);
    onInputChange?.(item);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onInputChange?.(value);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Create a sorted list of items based on relevance to the search term
  const sortedItems = items.sort((a, b) => {
    const aIncludes = a.toLowerCase().includes(searchTerm.toLowerCase());
    const bIncludes = b.toLowerCase().includes(searchTerm.toLowerCase());

    if (aIncludes && !bIncludes) return -1;
    if (!aIncludes && bIncludes) return 1;
    return 0;
  });

  // Include 'Other' option if required and not already included
  if (includeOther && !sortedItems.includes('Other')) {
    sortedItems.push('Other');
  }

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <label className={`${labelClassName}`}>{label}</label>
      <div className="flex items-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={`w-full ${inputClassName}`}
          placeholder="Select an option"
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
          {sortedItems.map((item) => (
            <div
              key={item}
              onClick={() => handleItemClick(item)}
              className={`${itemClassName} cursor-pointer flex justify-between items-center`}
            >
              <span>{item}</span>
              {item === selectedItem && <CheckIcon className="ml-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;