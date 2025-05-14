"use client";
import { Toaster } from 'react-hot-toast';
import '../../styles/globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../store/store';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex justify-center items-center h-screen w-full">
        <Toaster position="bottom-center" />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider> 
      </body>
    </html>
  );
}
