// contexts/NotificationContext.tsx
// @ts-nocheck
import React, { createContext, useContext, useState } from 'react';
import * as Notifications from 'expo-notifications';

type NotificationContextType = {
  sendNotification: (title: string, body: string, data?: any, icon?: string) => Promise<void>;
  expoPushToken: string;
  setExpoPushToken: (token: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }:any) => {
  const [expoPushToken, setExpoPushToken] = useState('');

  const sendNotification = async (title: string, body: string, data?: any, icon?: string) => {
    if (!expoPushToken) {
      console.error('Expo push token is not available');
      return;
    }

    console.log('notificationContext', icon)

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          icon, // Add this line
        },
        trigger: null,
      });
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ sendNotification, expoPushToken, setExpoPushToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};