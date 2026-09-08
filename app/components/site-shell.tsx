import ScrollToTop from './buttons/scroll-to-top';
import Subscriber from './subscriber';
import AnnouncementBar from './announcement-bar';
import GuestChrome from './booking/guest-chrome';

/**
 * Persistent site chrome for all public pages.
 * Lives in the root layout so Navbar/Footer/booking state do not remount on every navigation.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="pointer-events-none fixed inset-0 z-[70] border-[8px] border-[#003E48] sm:border-[12px]" />
            <div className="min-h-screen bg-[#003E48] p-2 sm:p-3">
                <AnnouncementBar />
                <GuestChrome>{children}</GuestChrome>
            </div>
            <Subscriber />
            <ScrollToTop />
        </>
    );
}
