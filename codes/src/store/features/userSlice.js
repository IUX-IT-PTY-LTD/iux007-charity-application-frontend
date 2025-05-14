import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Add debug logging to check full payload structure
      console.log("Full action payload:", action.payload);
      
      // Safely access nested properties
      const accessToken = action.payload?.accessToken || action.payload?.access_token;
      const refreshToken = action.payload?.refreshToken || action.payload?.refresh_token;
      
      state.user = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!accessToken; // Convert to boolean
      
      // Verify state updates
      console.log("Updated state:", {
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      });
    },
    getUser: (state) => {
      return state.user;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout, getUser } = userSlice.actions;
export default userSlice.reducer;