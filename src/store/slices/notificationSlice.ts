import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LiveNotification {
  id: string;
  type: string;
  title: string;
  description: string;
  unread: boolean;
  createdAt: string;
  data?: unknown;
}

interface NotificationState {
  items: LiveNotification[];
  socketConnected: boolean;
}

const initialState: NotificationState = {
  items: [],
  socketConnected: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<LiveNotification>) => {
      state.items.unshift(action.payload);
    },
    markAllNotificationsAsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, unread: false }));
    },
    clearNotifications: (state) => {
      state.items = [];
    },
    setSocketConnectedState: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
  },
});

export const {
  addNotification,
  markAllNotificationsAsRead,
  clearNotifications,
  setSocketConnectedState,
} = notificationSlice.actions;
export default notificationSlice.reducer;
