import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { ImageIcon } from '@/components/icons/image-icon';
import { DeleteIcon } from '@/components/icons/delete-icon';

export const ItemImageSection: React.FC = () => {
    const { theme } = useTheme();
    const [images, setImages] = useState<string[]>([]);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const isDark = theme === 'dark' || !theme;
    const borderColor = isDark ? 'border-gray-600' : 'border-gray-200';
    const borderRadius = 'rounded-lg';
    const placeholderColor = isDark ? 'bg-gray-700' : 'bg-gray-200';
    const textColor = isDark ? 'text-white' : 'text-gray-900';

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files).map(file => URL.createObjectURL(file));
            setImages(prevImages => [...prevImages, ...fileArray].slice(0, 4));
        }
    };

    const handleDeleteImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setHoverIndex(null); // Reset hover index upon deletion
    };

    return (
        <div className={`border-2 ${borderColor} ${borderRadius} p-4 mb-2`}> {/* Adjusted mb-6 to mb-2 */}
            <div className={`flex flex-row overflow-x-auto gap-4 items-start`} style={{ scrollbarWidth: 'thin' }}>
                {images.length === 0 && (
                    <label htmlFor="imageUpload" className={`flex-shrink-0 w-24 h-24 border-dotted ${borderColor} border-2 ${placeholderColor} ${borderRadius} flex justify-center items-center cursor-pointer`}>
                        <ImageIcon className="text-white w-6 h-6" />
                        <input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                )}

                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`relative flex-shrink-0 w-24 h-24 transition-opacity duration-300`}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onTouchStart={() => setHoverIndex(index)}
                        onTouchEnd={() => setHoverIndex(null)}
                    >
                        <div className={`w-full h-full bg-cover bg-center ${borderRadius} border ${borderColor} ${index === hoverIndex ? 'opacity-50' : 'opacity-100'}`} style={{ backgroundImage: `url(${image})`, transition: 'opacity 0.3s ease-in-out' }}>
                            {/* Image shown here */}
                        </div>
                        {hoverIndex === index && (
                            <button
                                onClick={() => handleDeleteImage(index)}
                                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
                                aria-label="Delete image"
                            >
                                <DeleteIcon className="text-white w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}

                {images.length > 0 && (
                    <label htmlFor="imageUpload" className={`flex-shrink-0 w-24 h-24 border-dotted ${borderColor} border-2 ${placeholderColor} ${borderRadius} flex justify-center items-center cursor-pointer`}>
                        <ImageIcon className="text-white w-6 h-6" />
                        <input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                )}
           </div>
        {images.length > 0 && (
            <div className="flex mt-2">
                <span className={`${textColor} text-xs font-semibold`}>Cover Image</span>
            </div>
        )}
    </div>
    );
};