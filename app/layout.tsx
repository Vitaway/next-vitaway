import TopProgressBar from "./components/top-progress-bar";
import { CartProvider } from '@/context/CartContext';
import "./globals.css";

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">
        <TopProgressBar />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
