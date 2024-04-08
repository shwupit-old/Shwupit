import React from 'react';
import Button from '@/components/ui/button'; 
import { useTheme } from 'next-themes';

const CreateSwapHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const buttonBgColor = isDark ? 'bg-blue-600' : 'bg-blue-400';
  

  return (
    <div style={{ 
      top: '70px',
      backgroundColor: isDark ? '#181818' : 'white', // Directly set the background color based on the theme
      borderBottom: `1px solid ${borderColor}`,
      padding: '16px 0'
    }}>
      <div className="px-4 flex justify-between items-center">
        <h2 className="text-base sm:text-sm lg:text-lg font-bold text-gray-600 dark:text-white">Add Swap Item</h2>
        <div className="flex items-center">
          <Button className={`text-xs sm:text-sm mx-1 p-1 sm:p-2 ${buttonBgColor} text-white`}>
            Save Draft
          </Button>
          <Button className={`text-xs sm:text-sm mx-1 p-1 sm:p-2 ${buttonBgColor} text-white`}>
            Publish Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSwapHeader;