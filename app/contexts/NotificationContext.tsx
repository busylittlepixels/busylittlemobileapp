import React, { createContext, useContext, useState } from 'react';
import { sendPushNotification } from '../lib/utils/notificationSetup';

type NotificationContextType = {
  sendNotification: (title: string, body: string, data?: any) => Promise<void>;
  expoPushToken: string;
  setExpoPushToken: (token: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }:any) => {
  const [expoPushToken, setExpoPushToken] = useState('');

  const sendNotification = async (title: string, body: string, data?: any) => {
    if (!expoPushToken) {
      console.error('Expo push token is not available');
      return;
    }
    try {
      await sendPushNotification(expoPushToken, title, body, data);
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