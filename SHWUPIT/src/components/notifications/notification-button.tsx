'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { EmptyNotificationIcon } from '@/components/icons/empty-notifications';
import { NotificationIcon } from '@/components/icons/notifications-icon';

const NotificationButton: React.FC = () => {
  const [hasNotifications, setHasNotifications] = useState<boolean>(false);

  const toggleNotifications = () => {
    setHasNotifications(!hasNotifications);
  };

  return (
    <Button onClick={toggleNotifications}>
      {hasNotifications ? <NotificationIcon /> : <EmptyNotificationIcon />}
    </Button>
  );
};

export default NotificationButton;