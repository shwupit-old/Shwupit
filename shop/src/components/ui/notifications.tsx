import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { EmptyNotificationsIcon } from '../icons/empty-notifications-icon';
import { NotificationsIcon } from '../icons/notifications-icon';
import styles from './NotificationSwitcher.module.css';

const NotificationSwitcher = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };


  const wrapperClass = !showNotifications ? styles.notificationIconWrapperWithDot : styles.notificationIconWrapper;

  return (
    <Button
      variant="icon"
      aria-label="Notifications Toggle"
      onClick={toggleNotifications}
      className="h-7 w-7 relative"
    >
      <div className={wrapperClass}>
        {showNotifications ? (
          <NotificationsIcon className="h-5 w-5 text-current" />
        ) : (
          <EmptyNotificationsIcon className="h-5 w-5 text-current" />
        )}
      </div>
    </Button>
  );
};

export default NotificationSwitcher;