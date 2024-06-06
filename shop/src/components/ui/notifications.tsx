import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import Button from '@/components/ui/button';
import { EmptyNotificationsIcon } from '../icons/empty-notifications-icon';
import { NotificationsIcon } from '../icons/notifications-icon';
import NotificationSlash from '../icons/notifications-slash';
import { StarIcon } from '../icons/star-icon';
import styles from './NotificationSwitcher.module.css';

// Mock notifications data
const notifications = [
  { 
    id: 1, 
    type: 'Swap Request', 
    message: 'You have received a new swap request from user123. Please respond within <b>24 hours</b>.', 
    imageUrl: 'https://media-photos.depop.com/b1/28908684/1861306369_e805e71e63024b248a20e1a45f62920b/P0.jpg', 
    timestamp: '2 hours ago', 
    read: false 
  },
  { 
    id: 2, 
    type: 'Swap Status', 
    message: 'Your swap request with user456 has been accepted. Please send the payment for the item value.', 
    imageUrl: 'https://media-photos.depop.com/b1/39549316/1868821824_194272373d36465f8d2c0595cbf0e777/P0.jpg', 
    timestamp: '1 day ago', 
    read: false 
  },
  { 
    id: 3, 
    type: 'New Message', 
    message: 'You have received a new message from user789.', 
    imageUrl: 'https://plus.unsplash.com/premium_photo-1688891564708-9b2247085923?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    timestamp: '3 days ago', 
    read: false 
  },
  { 
    id: 4, 
    type: 'Review Swap', 
    message: 'Please leave a review for Alimat.', 
    imageUrl: 'https://media-photos.depop.com/b1/29379624/1656830359_84a49f3f8bb841289c5c7eb816a84830/P0.jpg', 
    timestamp: '5 days ago', 
    read: false 
  },
  { 
    id: 5, 
    type: 'Pending Swap', 
    message: 'You have pending swap requests. Please review them.', 
    imageUrl: 'https://media-photos.depop.com/b1/37878825/1743087584_ffb1b1df702a420baf836cf3ebc56c9e/P0.jpg', 
    timestamp: '1 week ago', 
    read: false 
  },
];

const NotificationSwitcher = () => {
  const [notificationList, setNotificationList] = useState(notifications);

  const handleNotificationClick = (id) => {
    setNotificationList(notificationList.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadNotifications = notificationList.some(notification => !notification.read);
  const wrapperClass = unreadNotifications ? styles.notificationIconWrapperWithDot : styles.notificationIconWrapper;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        as={Button}
        variant="icon"
        aria-label="Notifications Toggle"
        className="h-7 w-7 relative"
      >
        <div className={wrapperClass}>
          {unreadNotifications ? (
            <NotificationsIcon className="h-5 w-5 text-current" />
          ) : (
            <EmptyNotificationsIcon className="h-5 w-5 text-current" />
          )}
        </div>
      </Menu.Button>
      <Menu.Items className="absolute left-[-230px] md:left-[-390px] sm:left-[-260px] lg:left-[-420px] mt-2 w-[280px] sm:w-[420px] lg:w-[450px] bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="max-h-60 overflow-y-auto">
          {notificationList.length > 0 ? (
            notificationList.map((notification) => (
              <Menu.Item key={notification.id}>
                {({ active }) => (
                  <div
                    className={`flex items-center px-4 py-3 text-sm cursor-pointer
                      ${notification.read ? 'bg-white' : 'bg-gray-100'}
                      ${active ? 'bg-gray-50' : ''}
                      border-b border-gray-200
                    `}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className={`flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-24 lg:h-24 mr-4`}>
                      <img 
                        src={notification.imageUrl} 
                        alt="Notification" 
                        className={`w-full h-full object-cover ${notification.type === 'New Message' ? 'rounded-full' : 'rounded'}`} 
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold mt-2 mb-0">{notification.type}</p>
                      <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: notification.message.replace(/24 hours/, '<b>24 hours</b>') }}></p>
                      {notification.type === 'Review Swap' && (
                        <div className="flex space-x-1 mt-0 mb-3">
                          {Array(5).fill(0).map((_, index) => (
                            <StarIcon key={index} className="w-4 h-4 text-blue-300" />
                          ))}
                        </div>
                      )}
                      <p className="text-gray-500 text-xs">{notification.timestamp}</p>
                    </div>
                  </div>
                )}
              </Menu.Item>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <NotificationSlash className="h-24 w-24 text-gray-400 mb-4" style={{ strokeWidth: 2 }} />
              <p className="text-gray-500">No new notifications</p>
            </div>
          )}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default NotificationSwitcher;
