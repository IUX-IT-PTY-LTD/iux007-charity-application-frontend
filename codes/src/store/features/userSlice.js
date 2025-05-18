import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  try {
    const savedUser = localStorage.getItem('user');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');

    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      accessToken: savedAccessToken || null,
      refreshToken: savedRefreshToken || null,
      isAuthenticated: !!savedAccessToken,
    };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    };
  }
};

const initialState = loadInitialState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Add debug logging to check full payload structure
      console.log('Full action payload:', action.payload);

      // Safely access nested properties
      const accessToken = action.payload?.access_token;
      const refreshToken = action.payload?.refresh_token;
      const userData = action.payload?.user || action.payload;

      // Update localStorage
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (userData) localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      state.user = userData;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!accessToken;

      // Verify state updates
      console.log('Updated state:', {
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      });
    },
    getUser: (state) => {
      return state.user;
    },
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Clear state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout, getUser } = userSlice.actions;
export default userSlice.reducer;
