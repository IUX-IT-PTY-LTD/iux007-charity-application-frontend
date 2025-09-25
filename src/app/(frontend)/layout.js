'use client';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Poppins } from 'next/font/google';
import '../../styles/globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../store/store';
import { ColorSchemeProvider } from '@/contexts/ColorSchemeContext';

// export const metadata = {
//   title: 'Charity',
//   description: 'Charity is Noble',
//   icon: '/favicon.ico',
// };

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Specify the weights you want to use
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ColorSchemeProvider>
              <Header />
              {children}
              <Footer />
            </ColorSchemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
