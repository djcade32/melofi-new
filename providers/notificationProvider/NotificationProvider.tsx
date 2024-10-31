"use client";

import Toaster from "@/ui/components/shared/toaster/Toaster";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import { NotificationType } from "@/types/interfaces";
import React, { useEffect, useState } from "react";

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const {
    notificationQueue,
    removeNotification,
    showNotification,
    setShowNotification,
    currentNotification,
    setCurrentNotification,
  } = useNotificationProviderStore();

  //   const [currentNotification, setCurrentNotification] = useState<NotificationType | null>(null);

  // Show notification if there is a notification in the queue
  useEffect(() => {
    if (showNotification) {
      return;
    }
    setShowNotification(notificationQueue.length > 0);
    if (notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
    }
  }, [notificationQueue]);

  // Remove notification after 5 seconds
  useEffect(() => {
    if (showNotification) {
      setTimeout(() => {
        removeNotification();
        setShowNotification(false);
      }, 5000);
    }
  }, [showNotification]);

  return (
    <div>
      {children}
      <Toaster
        message={currentNotification?.message || ""}
        type={currentNotification?.type}
        show={showNotification}
      />
    </div>
  );
};

export default NotificationProvider;
