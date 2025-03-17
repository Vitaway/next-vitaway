import TopProgressBar from "./components/top-progress-bar";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <TopProgressBar />
        {children}
      </body>
    </html>
  );
}
