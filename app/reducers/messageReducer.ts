const initialState = {
    messages: [],
    offlineMessages: [],
  };
  
  const messageReducer = (state = initialState, action: { type: any; payload: { message: any; }; meta: { message: any; }; }) => {
    console.log('action', action)
    switch (action.type) {
    
        case 'SEND_MESSAGE':
        return {
          ...state,
          offlineMessages: [...state.offlineMessages, action.payload.message],
        };
      case 'SEND_MESSAGE_COMMIT':
        return {
          ...state,
          messages: [...state.messages, action.meta.message],
          offlineMessages: state.offlineMessages.filter(msg => msg !== action.meta.message),
        };
      case 'SEND_MESSAGE_ROLLBACK':
        return {
          ...state,
          offlineMessages: state.offlineMessages.filter(msg => msg !== action.meta.message),
        };
      default:
        return state;
    }
  };
  
  export default messageReducer;
  