import AppointmentButton from "../components/buttons/AppointmentButton";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Subscriber from "../components/subscriber";

export default function GuestLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <Subscriber />
            <AppointmentButton />
        </>
    );
}