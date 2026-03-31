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
}

const initialState: NotificationState = {
  items: [],
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
  },
});

export const { addNotification, markAllNotificationsAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
