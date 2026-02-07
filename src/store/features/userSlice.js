import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      cart: {
        cartItems: [],
        cartCount: 0,
      }
    };
  }

  try {
    const savedUser = localStorage.getItem('user');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = cartItems.length;

    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      accessToken: savedAccessToken || null,
      refreshToken: savedRefreshToken || null,
      isAuthenticated: !!savedAccessToken,
      cart: {
        cartItems: cartItems,
        cartCount: cartCount,
      }
    };
  } catch (error) {
    console.error('Error loading auth state:', error);
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      cart: {
        cartItems: [],
        cartCount: 0,
      }
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

      // Update localStorage only if in browser environment
      if (typeof window !== 'undefined') {
        try {
          if (accessToken) localStorage.setItem('accessToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          if (userData) localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.warn('Could not access localStorage during setUser:', error);
        }
      }

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
    updateUser: (state, action) => {
      // Update user data
      state.user = { ...state.user, ...action.payload };
      
      // Update localStorage only if in browser environment
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('user', JSON.stringify(state.user));
        } catch (error) {
          console.warn('Could not access localStorage during updateUser:', error);
        }
      }
    },
    logout: (state) => {
      // Clear localStorage only if in browser environment
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } catch (error) {
          console.warn('Could not access localStorage during logout:', error);
        }
      }

      // Clear state
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setUserCart: (state, action) => {
      state.cart.cartItems = action.payload;
      state.cart.cartCount = action.payload.length;
    },
    removeUserCart: (state) => {
      state.cart.cartItems = [];
      state.cart.cartCount = 0;
    },
  },
});

export const { setUser, logout, getUser, setUserCart, updateUser, removeUserCart } = userSlice.actions;
export default userSlice.reducer;
