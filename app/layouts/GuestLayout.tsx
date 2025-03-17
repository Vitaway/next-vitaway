import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Subscriber from "../components/subscriber";

export default function GuestLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <Navbar />
                {children}
                <Footer />
                <Subscriber />
            </body>
        </html>
    );
}