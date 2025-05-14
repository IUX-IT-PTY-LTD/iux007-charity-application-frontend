import { Poppins } from 'next/font/google';
import '../../styles/globals.css';

export const metadata = {
  title: 'Charity',
  description: 'Charity is Noble',
  icon: '/favicon.ico',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Specify the weights you want to use
});

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="admin-layout">{children}</body>
    </html>
  );
}
