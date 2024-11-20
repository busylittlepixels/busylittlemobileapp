// @ts-nocheck
// NotificationSetup.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from "../services/auth/authApi";
import { supabase } from '@/supabase'; // Make sure to import supabase
import { sendPushNotification } from '../lib/utils/notificationSetup';

const NotificationSetup = ({ expoPushToken }) => {
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          async (payload) => {
            // Fetch sender's name
            const { data: senderData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();

            const senderName = senderData?.full_name || 'Someone';

            // Send push notification
            await sendPushNotification(
              expoPushToken,
              'New Message',
              `${senderName}: ${payload.new.message}`,
              { messageId: payload.new.id }
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, expoPushToken]);

  return null; // This component doesn't render anything
};

export default NotificationSetup;
