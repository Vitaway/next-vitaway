import TopProgressBar from "./components/top-progress-bar";
import { CartProvider } from '@/context/CartContext';
import "./globals.css";
import Script from 'next/script';

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="//code.tidio.co/mwzeombpb11eeirlfz6ba2uar9jhcvoc.js" strategy="afterInteractive" />
      </head>
      <body className="app-body">
        <TopProgressBar />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
