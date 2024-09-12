import { supabase } from '../../supabase';

export const sendMessage = (messageData: any) => ({
    type: 'SEND_MESSAGE',
    payload: { messageData },
    meta: {
      offline: {
        // Effect to be executed when online
        effect: async () => {
          const { data, error } = await supabase
            .from('messages')
            .insert([messageData]);
          
          if (error) {
            throw new Error('Failed to send message');
          }
  
          return data;
        },
        // Action to dispatch when the message is successfully sent
        commit: { type: 'SEND_MESSAGE_COMMIT', meta: { messageData } },
        // Action to dispatch if sending the message fails
        rollback: { type: 'SEND_MESSAGE_ROLLBACK', meta: { messageData } },
      },
    },
  });
  