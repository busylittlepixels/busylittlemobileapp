// components/NotificationHandler.tsx
// @ts-nocheck
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/supabase';
import { sendPushNotification } from '../lib/utils/notificationSetup';

const NotificationHandler = ({ expoPushToken }) => {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user || !expoPushToken) return;

    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          if (payload.new.receiver_id === user.id) {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();
            
            const senderName = senderData?.full_name || 'Someone';
            
            await sendPushNotification(
              expoPushToken,
              'New Message',
              `${senderName}: ${payload.new.message}`,
              { messageId: payload.new.id }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, expoPushToken]);

  return null;
};

export default NotificationHandler;