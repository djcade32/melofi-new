"use client";

import Toaster from "@/ui/components/shared/toaster/Toaster";
import useNotificationProviderStore from "@/stores/notification-provider-store";
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
  const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | null>(null);

  // Show notification if there is a notification in the queue
  useEffect(() => {
    if (showNotification) {
      if (currentNotification?.type === "alarm") {
        removeNotification();
        setShowNotification(false);
      }
      return;
    }
    setShowNotification(notificationQueue.length > 0);
    if (notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
    } else {
      if (timeoutState) clearTimeout(timeoutState);
    }
  }, [notificationQueue]);

  // Remove notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      if (currentNotification?.type === "alarm") return;
      if (timeoutState) clearTimeout(timeoutState);
      setTimeoutState(
        setTimeout(() => {
          removeNotification();
          setShowNotification(false);
        }, 3000)
      );
    }
  }, [showNotification]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
      <Toaster
        message={currentNotification?.message || ""}
        type={currentNotification?.type}
        show={showNotification}
        icon={currentNotification?.icon}
        actions={currentNotification?.actions}
      />
    </div>
  );
};

export default NotificationProvider;
