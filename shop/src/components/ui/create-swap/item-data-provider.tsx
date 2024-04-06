
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Item {
  name: string;
  description: string;
}

const ItemDataContext = createContext<Item[]>([]);

interface ItemDataProviderProps {
  children: ReactNode;
}

export const ItemDataProvider: React.FC<ItemDataProviderProps> = ({ children }) => {
  const [itemData, setItemData] = useState<Item[]>([]);

  useEffect(() => {
    const data: Item[] = [
        {
            "name": "Jordan Sneakers",
            "description": "High-quality sneakers known for their stylish design and association with Michael Jordan. They offer comfort and durability, making them popular among athletes and fashion enthusiasts."
        },
        {
            "name": "Car Parts - Performance Exhaust",
            "description": "High-performance exhaust systems improve engine efficiency and sound. Ideal for car enthusiasts looking to enhance their vehicle's performance and aesthetics."
        },
        {
            "name": "Gaming Consoles - PlayStation 5",
            "description": "The latest gaming console from Sony, offering cutting-edge graphics and immersive gaming experiences. In high demand among gamers worldwide."
        },
        {
            "name": "Smartphones - iPhone 13",
            "description": "Apple's flagship smartphone with advanced features like improved camera capabilities, faster performance, and longer battery life. A must-have for tech enthusiasts."
        },
        {
            "name": "Laptops - MacBook Pro",
            "description": "High-performance laptops from Apple, known for their sleek design, powerful hardware, and user-friendly interface. Ideal for professionals and creatives."
        },
        {
            "name": "Wireless Earbuds - AirPods Pro",
            "description": "Premium wireless earbuds from Apple, offering active noise cancellation, immersive sound, and seamless integration with iOS devices. Popular among music lovers and commuters."
        },
        {
            "name": "Fitness Trackers - Fitbit Charge 5",
            "description": "Advanced fitness trackers with features like heart rate monitoring, activity tracking, and built-in GPS. Perfect for fitness enthusiasts and those leading an active lifestyle."
        },
        {
            "name": "Streaming Devices - Roku Ultra",
            "description": "Powerful streaming device offering 4K HDR streaming, voice control, and a wide range of streaming channels. Enhance your home entertainment experience with Roku Ultra."
        },
        {
            "name": "Instant Cameras - Fujifilm Instax Mini 11",
            "description": "Compact instant camera producing credit card-sized prints. Perfect for capturing memories on-the-go and creating tangible photo keepsakes."
        },
        {
            "name": "Wireless Speakers - Sonos One",
            "description": "High-fidelity wireless speakers with built-in voice assistants, delivering immersive sound and smart home integration. Elevate your listening experience with Sonos One."
        },
        {
            "name": "Coffee Makers - Keurig K-Cafe",
            "description": "Versatile coffee maker brewing various coffee sizes and specialty drinks like lattes and cappuccinos. Ideal for coffee enthusiasts seeking convenience and cafe-quality beverages at home."
        },
        {
            "name": "Smartwatches - Apple Watch Series 7",
            "description": "Feature-rich smartwatch with health monitoring, fitness tracking, and communication capabilities. Stay connected and motivated with the Apple Watch Series 7."
        },
        {
            "name": "Digital Cameras - Canon EOS Rebel T7i",
            "description": "Entry-level DSLR camera with advanced features for capturing high-quality photos and videos. Perfect for photography enthusiasts and beginners."
        },
        {
            "name": "Gaming Keyboards - Razer BlackWidow Elite",
            "description": "Mechanical gaming keyboard with customizable RGB lighting, programmable keys, and tactile switches. Enhance your gaming performance and style with the Razer BlackWidow Elite."
        },
        {
            "name": "Robot Vacuum Cleaners - iRobot Roomba i7+",
            "description": "High-performance robot vacuum cleaner with intelligent mapping, self-emptying bin, and powerful suction. Keep your home clean effortlessly with the iRobot Roomba i7+."
        },
        {
            "name": "Electric Toothbrushes - Oral-B Pro 1000",
            "description": "Rechargeable electric toothbrush with pressure sensor and oscillating-rotating technology for superior plaque removal. Achieve a dentist-clean feeling every day with the Oral-B Pro 1000."
        },
        {
            "name": "Wireless Gaming Headsets - SteelSeries Arctis Pro",
            "description": "Premium wireless gaming headset with high-fidelity audio, noise-canceling microphone, and customizable RGB lighting. Immerse yourself in gaming with the SteelSeries Arctis Pro."
        },
        {
            "name": "Home Security Cameras - Ring Spotlight Cam",
            "description": "Outdoor security camera with motion-activated LED spotlights, two-way audio, and HD video. Monitor your property and deter intruders with the Ring Spotlight Cam."
        },
        {
            "name": "Electric Scooters - Segway Ninebot Max",
            "description": "Long-range electric scooter with a powerful motor, durable construction, and intuitive controls. Enjoy convenient and eco-friendly transportation with the Segway Ninebot Max."
        },
        {
            "name": "Bluetooth Headphones - Sony WH-1000XM4",
            "description": "Premium Bluetooth headphones with industry-leading noise cancellation, long battery life, and exceptional sound quality. Experience immersive audio with the Sony WH-1000XM4."
        }
    ];
    setItemData(data);
  }, []);

  return (
    <ItemDataContext.Provider value={itemData}>
      {children}
    </ItemDataContext.Provider>
  );
};

export const useItemData = () => useContext(ItemDataContext);