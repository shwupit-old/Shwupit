import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: string;
  items: string[];
  onItemSelect?: (item: string) => void;
  className?: string;
  inputClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  dropdownClassName?: string;
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const filtered = items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredItems(filtered);

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, searchTerm, items]);

  const handleItemClick = (item: string) => {
    setSearchTerm(item); // Consider resetting the searchTerm if you want the input to reflect the selected item
    setIsOpen(false);
    onItemSelect?.(item);
  };



  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <label className={`${labelClassName}`}>{label}</label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className={`${inputClassName}`}
      />
      {isOpen && (
        <div className={`absolute z-10 mt-1 w-full overflow-auto shadow-md max-h-60 ${dropdownClassName}`}>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className={`${itemClassName}`}
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