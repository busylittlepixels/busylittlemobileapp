// hooks/useMessageSubscription.ts
// @ts-nocheck
import { useEffect } from 'react';
import { supabase } from "@/supabase";
import { useNotification } from '../contexts/NotificationContext';
import { useSelector } from "react-redux";
import * as Updates from 'expo-updates';
import { Image } from 'react-native';

export const useMessageSubscription = () => {
  const { sendNotification } = useNotification();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  // Use a default icon asset
  const defaultIcon = require('../assets/images/blp-splash.png');
  // Attempt to get the notification icon from the manifest
  const manifestIcon = Updates.manifest?.notification?.icon;

  // Resolve the icon
  const notificationIcon = manifestIcon 
    ? { uri: manifestIcon } 
    : Image.resolveAssetSource(defaultIcon).uri;

  console.log('message sub hook - icon:', notificationIcon);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          if (payload.new.receiver_id === userId) {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();
            
            const senderName = senderData?.full_name || 'Someone';
            
            sendNotification(
              'New message in BLP app',
              `${senderName}: ${payload.new.message}`,
              { senderId: payload.new.sender_id },
              notificationIcon
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, sendNotification, notificationIcon]);
};