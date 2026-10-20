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
            <div className="pointer-events-none fixed inset-0 z-[70] border-[6px] border-[#003E48] sm:border-[12px]" />
            <div className="min-h-dvh bg-[#003E48] px-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] pb-[max(0.375rem,env(safe-area-inset-bottom))] sm:p-3">
                <AnnouncementBar />
                <GuestChrome>{children}</GuestChrome>
            </div>
            <Subscriber />
            <ScrollToTop />
        </>
    );
}
