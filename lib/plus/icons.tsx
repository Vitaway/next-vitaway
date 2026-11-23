/**
 * Vitaway line icons (23 Nov 2026), drawn in the Inzu mobile app's TabNavIcon style:
 * 24×24 grid, bold rounded strokes, rounded corners, filled dots. `variant="Bold"` (or "Bulk")
 * keeps the outline and adds a soft tinted fill, exactly like Inzu's active tab icons.
 *
 * Drop-in replacement for the iconsax-react / react-icons/md icons the PWA used: same export
 * names and the same props (`size`, `color`, `variant`, `className`, `style`), so screens only
 * change their import line. The old "play"-looking ArrowRight3 is now a proper arrow.
 */
import type { CSSProperties, ReactNode } from "react";

export type IconProps = {
  size?: number | string;
  color?: string;
  variant?: string;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
  title?: string;
  /** Overrides the stroke weight (2, or 2.3 for Bold). */
  strokeWidth?: number | string;
};

/** f = fill props for "fillable" shapes (none, or a soft tint when the variant is Bold). */
type Ctx = { f: { fill: string; fillOpacity: number }; c: string; dot: (x: number, y: number, r?: number) => ReactNode };

function make(name: string, draw: (x: Ctx) => ReactNode, defaultSize: number | string = 24) {
  function Icon({ size = defaultSize, color = "currentColor", variant, className, style, title, strokeWidth, ...rest }: IconProps) {
    const solid = variant === "Bold" || variant === "Bulk";
    const ctx: Ctx = {
      c: color,
      f: solid ? { fill: color, fillOpacity: 0.22 } : { fill: "none", fillOpacity: 0 },
      dot: (x, y, r = 1.15) => <circle cx={x} cy={y} r={r} fill={color} stroke="none" />,
    };
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth ?? (solid ? 2.3 : 2)}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ flex: "none", ...style }}
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : (rest["aria-hidden"] ?? true)}
      >
        {title ? <title>{title}</title> : null}
        {draw(ctx)}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

const doc = (f: Ctx["f"]) => (
  <>
    <path d="M14 3.5H7.5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V9Z" {...f} />
    <path d="M14 3.5V7a2 2 0 0 0 2 2h3.5" />
  </>
);
const calendar = (f: Ctx["f"]) => (
  <>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" {...f} />
    <path d="M3.5 9.8h17M8 3v4M16 3v4" />
  </>
);
const bubble = (f: Ctx["f"]) => <path d="M4 6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3V14a3 3 0 0 1-3 3h-5l-4.5 3.5V17H7a3 3 0 0 1-3-3Z" {...f} />;
const eye = (f: Ctx["f"]) => (
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" {...f} />
    <circle cx="12" cy="12" r="3" />
  </>
);
const gallery = (f: Ctx["f"], c: Ctx) => (
  <>
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" {...f} />
    {c.dot(9, 9.5, 1.7)}
    <path d="M3.8 17l5.2-4.6 3.5 3 3-2.4 5 4.4" />
  </>
);
const out = (
  <>
    <path d="M9.5 4.5H7a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h2.5" />
    <path d="M14 7.5 18.5 12 14 16.5M18.5 12H9" />
  </>
);
const arrowRight = <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />;
const arrowLeft = <path d="M19.5 12H5M10.5 6.5 5 12l5.5 5.5" />;

export const Add = make("Add", () => <path d="M12 5v14M5 12h14" />);
export const ArrowRight3 = make("ArrowRight3", () => arrowRight);
export const ArrowLeft = make("ArrowLeft", () => arrowLeft);
export const ArrowDown2 = make("ArrowDown2", () => <path d="M6 9.5l6 6 6-6" />);
export const Call = make("Call", ({ f }) => (
  <path d="M6.6 3.5h2.6l1.6 4.2-2.1 1.5a11 11 0 0 0 6.1 6.1l1.5-2.1 4.2 1.6v2.6a2.2 2.2 0 0 1-2.4 2.2C10.9 19 5 13.1 4.4 5.9a2.2 2.2 0 0 1 2.2-2.4Z" {...f} />
));
export const TickCircle = make("TickCircle", ({ f }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <path d="M8.2 12.3l2.6 2.6 5-5.4" />
  </>
));
export const TickSquare = make("TickSquare", ({ f }) => (
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" {...f} />
    <path d="M8 12.2l2.7 2.7 5.3-5.6" />
  </>
));
export const CloseCircle = make("CloseCircle", ({ f }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <path d="M9 9l6 6M15 9l-6 6" />
  </>
));
export const Calendar1 = make("Calendar1", (x) => (
  <>
    {calendar(x.f)}
    {x.dot(8.5, 14)}
    {x.dot(12, 14)}
    {x.dot(15.5, 14)}
    {x.dot(8.5, 17.2)}
  </>
));
export const CalendarTick = make("CalendarTick", ({ f }) => (
  <>
    {calendar(f)}
    <path d="M9 15l2 2 4-4.2" />
  </>
));
export const CalendarRemove = make("CalendarRemove", ({ f }) => (
  <>
    {calendar(f)}
    <path d="M9.8 12.8l4.4 4.4M14.2 12.8l-4.4 4.4" />
  </>
));
export const Clock = make("Clock", ({ f }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <path d="M12 7.5V12l3.2 2" />
  </>
));
export const Timer1 = make("Timer1", ({ f }) => (
  <>
    <circle cx="12" cy="13.5" r="7.5" {...f} />
    <path d="M12 9.5v4l2.5 1.5M9.5 2.8h5M12 2.8V6" />
  </>
));
export const Alarm = make("Alarm", ({ f }) => (
  <>
    <circle cx="12" cy="13" r="7.5" {...f} />
    <path d="M12 9.5V13l2.5 1.6M4.5 4.8 7 2.8M19.5 4.8 17 2.8" />
  </>
));
export const Trash = make("Trash", ({ f }) => (
  <>
    <path d="M6 6.5l1 12.6A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.9l1-12.6" {...f} />
    <path d="M4 6.5h16M9.5 6.5v-2h5v2M10 11v5.5M14 11v5.5" />
  </>
));
export const Refresh = make("Refresh", () => <path d="M20 12a8 8 0 1 1-2.4-5.7M20 4.5v4.6h-4.6" />);
export const Repeat = make("Repeat", () => (
  <path d="M4 11V9.5A3.5 3.5 0 0 1 7.5 6H20M17 3l3 3-3 3M20 13v1.5a3.5 3.5 0 0 1-3.5 3.5H4M7 21l-3-3 3-3" />
));
export const Heart = make("Heart", ({ f }) => (
  <path d="M12 20.2S3.2 15 3.2 8.9A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.8 2.1C20.8 15 12 20.2 12 20.2Z" {...f} />
));
export const Health = make("Health", ({ f }) => (
  <>
    <path d="M9.2 19.6a4.6 4.6 0 0 1-6.5-6.5l7.4-7.4a4.6 4.6 0 0 1 6.5 6.5Z" {...f} />
    <path d="M6.6 9.6l6.4 6.4" />
    <circle cx="18.6" cy="17.6" r="2.6" />
  </>
));
export const Activity = make("Activity", () => <path d="M2.5 12h4l2.5-6 5 12 2.5-6h5" />);
export const Weight = make("Weight", ({ f }) => (
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" {...f} />
    <path d="M8.2 10.5a4.5 4.5 0 0 1 7.6 0ZM12 10.5l1.6-2.4" />
  </>
));
export const Ruler = make("Ruler", ({ f }) => (
  <>
    <path d="M3.3 15.4 15.4 3.3a1.6 1.6 0 0 1 2.3 0l3 3a1.6 1.6 0 0 1 0 2.3L8.6 20.7a1.6 1.6 0 0 1-2.3 0l-3-3a1.6 1.6 0 0 1 0-2.3Z" {...f} />
    <path d="M7.5 11.5l2 2M10.5 8.5l2 2M13.5 5.5l2 2" />
  </>
));
export const Drop = make("Drop", ({ f }) => (
  <>
    <path d="M12 3.2s-6.5 7-6.5 11.3a6.5 6.5 0 0 0 13 0C18.5 10.2 12 3.2 12 3.2Z" {...f} />
    <path d="M9 14.8a3 3 0 0 0 2.4 2.7" />
  </>
));
export const Flash = make("Flash", ({ f }) => <path d="M13.2 2.8 5.5 13.5h5.8l-1 7.7 7.7-10.7h-5.8Z" {...f} />);
export const Cup = make("Cup", ({ f }) => (
  <>
    <path d="M4.5 8.5h11.5v5.5a5.75 5.75 0 0 1-11.5 0Z" {...f} />
    <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.2v2.3M12 3.2v2.3" />
  </>
));
export const Reserve = make("Reserve", ({ f, c }) => (
  <>
    <path d="M3 12.2h18a9 8.4 0 0 1-18 0Z" {...f} />
    <path d="M8 20.4h8M7.4 9.2V5.6M10 9.2V7" />
    <path d="M12.6 9.4c0-3.4 2.4-5.6 6-5.6 0 3.4-2.4 5.6-6 5.6Z" fill={c} fillOpacity={0.25} />
  </>
));
export const Camera = make("Camera", ({ f }) => (
  <>
    <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h2l1.5-2h5L16 6h2a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z" {...f} />
    <circle cx="12" cy="13" r="3.6" />
  </>
));
export const Gallery = make("Gallery", (x) => gallery(x.f, x));
export const GallerySlash = make("GallerySlash", (x) => (
  <>
    {gallery(x.f, x)}
    <path d="M3 3l18 18" />
  </>
));
export const Video = make("Video", ({ f }) => (
  <>
    <rect x="2.5" y="6" width="13.5" height="12" rx="3" {...f} />
    <path d="M16 10.5l5-3v9l-5-3" />
  </>
));
export const Play = make("Play", ({ f }) => <path d="M7 4.8v14.4a1 1 0 0 0 1.5.9l11-7.2a1 1 0 0 0 0-1.8l-11-7.2A1 1 0 0 0 7 4.8Z" {...f} />);
export const PlayCircle = make("PlayCircle", ({ f, c }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <path d="M10 8.6v6.8l5.3-3.4Z" fill={c} />
  </>
));
export const Notification = make("Notification", ({ f }) => (
  <>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15Z" {...f} />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0M12 3v2" />
  </>
));
export const Sms = make("Sms", ({ f }) => (
  <>
    <rect x="3" y="5" width="18" height="14" rx="3" {...f} />
    <path d="M3.8 7l8.2 6 8.2-6" />
  </>
));
export const Message = make("Message", (x) => (
  <>
    {bubble(x.f)}
    {x.dot(8.5, 10.3)}
    {x.dot(12, 10.3)}
    {x.dot(15.5, 10.3)}
  </>
));
export const MessageQuestion = make("MessageQuestion", (x) => (
  <>
    {bubble(x.f)}
    <path d="M10 8.6a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9v.3" />
    {x.dot(12, 13.9)}
  </>
));
export const MessageFavorite = make("MessageFavorite", ({ f }) => (
  <>
    {bubble(f)}
    <path d="M12 13.4s-3-1.7-3-3.7a1.5 1.5 0 0 1 3-.6 1.5 1.5 0 0 1 3 .6c0 2-3 3.7-3 3.7Z" />
  </>
));
export const Messages2 = make("Messages2", ({ f }) => (
  <>
    <path d="M8 7V6a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-.5" />
    <path d="M3 11a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H9l-3.5 3v-3H6a3 3 0 0 1-3-3Z" {...f} />
  </>
));
export const Lock = make("Lock", ({ f }) => (
  <>
    <rect x="4.5" y="10.5" width="15" height="10" rx="3" {...f} />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5V17" />
  </>
));
export const InfoCircle = make("InfoCircle", (x) => (
  <>
    <circle cx="12" cy="12" r="9" {...x.f} />
    <path d="M12 11v5.5" />
    {x.dot(12, 7.8)}
  </>
));
export const Warning2 = make("Warning2", (x) => (
  <>
    <circle cx="12" cy="12" r="9" {...x.f} />
    <path d="M12 7.5V13" />
    {x.dot(12, 16.3)}
  </>
));
export const Danger = make("Danger", (x) => (
  <>
    <path d="M10.3 4.2a2 2 0 0 1 3.4 0l7.2 12.6a2 2 0 0 1-1.7 3H4.8a2 2 0 0 1-1.7-3Z" {...x.f} />
    <path d="M12 9.5v4" />
    {x.dot(12, 16.6)}
  </>
));
export const NoteText = make("NoteText", ({ f }) => (
  <>
    <rect x="4.5" y="3.5" width="15" height="17" rx="3" {...f} />
    <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
  </>
));
export const DocumentText = make("DocumentText", ({ f }) => (
  <>
    {doc(f)}
    <path d="M8.5 13h7M8.5 16.5h5" />
  </>
));
export const DocumentText1 = DocumentText;
export const DocumentDownload = make("DocumentDownload", ({ f }) => (
  <>
    {doc(f)}
    <path d="M12 11v6M9.5 14.5 12 17l2.5-2.5" />
  </>
));
export const DocumentUpload = make("DocumentUpload", ({ f }) => (
  <>
    {doc(f)}
    <path d="M12 17v-6M9.5 13.5 12 11l2.5 2.5" />
  </>
));
export const ImportCurve = make("ImportCurve", () => <path d="M12 3.5v10M8 9.5l4 4 4-4M4.5 14.5v2A3.5 3.5 0 0 0 8 20h8a3.5 3.5 0 0 0 3.5-3.5v-2" />);
export const ClipboardText = make("ClipboardText", ({ f }) => (
  <>
    <rect x="5" y="4.5" width="14" height="16.5" rx="3" {...f} />
    <rect x="9" y="2.8" width="6" height="3.6" rx="1.5" />
    <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
  </>
));
export const TaskSquare = make("TaskSquare", ({ f }) => (
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" {...f} />
    <path d="M7.5 9l1.5 1.5L11.5 8M13.5 9.5H17M7.5 15l1.5 1.5 2.5-2.5M13.5 15.5H17" />
  </>
));
export const Stickynote = make("Stickynote", ({ f }) => (
  <>
    <path d="M5 3.5h14V14l-6.5 6.5H5Z" {...f} />
    <path d="M12.5 20.5V15.5a1.5 1.5 0 0 1 1.5-1.5h5M8.5 8.5h7M8.5 12h4" />
  </>
));
export const ReceiptItem = make("ReceiptItem", ({ f }) => (
  <>
    <path d="M5 3.5h14V21l-2.4-1.6-2.3 1.6-2.3-1.6-2.3 1.6-2.3-1.6L5 21Z" {...f} />
    <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
  </>
));
export const Copy = make("Copy", ({ f }) => (
  <>
    <rect x="8.5" y="8.5" width="12" height="12" rx="3" {...f} />
    <path d="M15.5 8.5v-2a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h2" />
  </>
));
export const Save2 = make("Save2", ({ f }) => (
  <>
    <path d="M6.5 3.5h10L20 7v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a2.5 2.5 0 0 1 2.5-2.5Z" {...f} />
    <path d="M8 3.5V8h7V3.5M8 21v-5.5h8V21" />
  </>
));
export const Printer = make("Printer", (x) => (
  <>
    <path d="M7 8V3.5h10V8" />
    <rect x="3.5" y="8" width="17" height="9" rx="2.5" {...x.f} />
    <rect x="7" y="13.5" width="10" height="7" rx="1.2" />
    {x.dot(17, 11)}
  </>
));
export const Paperclip2 = make("Paperclip2", () => (
  <path d="M14.5 7.5l-6 6a2 2 0 0 0 2.8 2.8l6.4-6.4a4 4 0 0 0-5.6-5.6l-6.6 6.6a6 6 0 0 0 8.5 8.5l5.5-5.5" />
));
export const FolderOpen = make("FolderOpen", ({ f }) => (
  <>
    <path d="M3.5 18V6.5a2 2 0 0 1 2-2h4l2 2h6.5a2 2 0 0 1 2 2V10" />
    <path d="M3.5 18l2.6-6.4a2 2 0 0 1 1.9-1.3H20a1.2 1.2 0 0 1 1.1 1.7L18.5 18a2 2 0 0 1-1.8 1.3H5A1.5 1.5 0 0 1 3.5 18Z" {...f} />
  </>
));
export const Mobile = make("Mobile", ({ f }) => (
  <>
    <rect x="6.5" y="2.8" width="11" height="18.4" rx="3" {...f} />
    <path d="M10.5 17.8h3" />
  </>
));
export const Bluetooth = make("Bluetooth", () => <path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9" />);
export const Edit2 = make("Edit2", ({ f }) => (
  <>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" {...f} />
    <path d="M13.5 6.5l4 4" />
  </>
));
export const Edit = make("Edit", ({ f }) => (
  <>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" {...f} />
    <path d="M13.5 6.5l4 4M13 20h7" />
  </>
));
export const User = make("User", ({ f }) => (
  <>
    <circle cx="12" cy="8" r="4" {...f} />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0Z" {...f} />
  </>
));
export const Profile = User;
export const UserAdd = make("UserAdd", ({ f }) => (
  <>
    <circle cx="10" cy="8" r="3.8" {...f} />
    <path d="M3 20.5a7 7 0 0 1 12.5-4.3M18.5 13.5v6M15.5 16.5h6" />
  </>
));
export const UserSearch = make("UserSearch", ({ f }) => (
  <>
    <circle cx="10" cy="8" r="3.8" {...f} />
    <path d="M3 20.5a7 7 0 0 1 9.5-6.5M19 19l2 2" />
    <circle cx="17" cy="17" r="2.8" />
  </>
));
export const People = make("People", ({ f }) => (
  <>
    <circle cx="9" cy="7.6" r="3.4" {...f} />
    <path d="M2.8 20.2c0-3.6 2.8-6.2 6.2-6.2s6.2 2.6 6.2 6.2Z" {...f} />
    <circle cx="16.6" cy="8.6" r="2.6" />
    <path d="M17.6 13.6c2.2.4 3.8 2.4 3.8 5h-3.6" />
  </>
));
export const Crown1 = make("Crown1", ({ f }) => (
  <>
    <path d="M3.5 8l4.3 3.6L12 5l4.2 6.6L20.5 8l-1.8 10H5.3Z" {...f} />
    <path d="M5.5 20.8h13" />
  </>
));
export const Award = make("Award", ({ f }) => (
  <>
    <circle cx="12" cy="9" r="5.5" {...f} />
    <path d="M8.6 13.4 7.5 21l4.5-2.5 4.5 2.5-1.1-7.6" />
  </>
));
export const Star1 = make("Star1", ({ f }) => (
  <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z" {...f} />
));
export const ShieldTick = make("ShieldTick", ({ f }) => (
  <>
    <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6Z" {...f} />
    <path d="M8.8 12l2.2 2.2 4.2-4.4" />
  </>
));
export const Setting2 = make("Setting2", ({ f }) => (
  <>
    <path d="M10 2.8h4l.6 2.6 2-1.1 2.8 2.8-1.1 2 2.6.6v4l-2.6.6 1.1 2-2.8 2.8-2-1.1-.6 2.6h-4l-.6-2.6-2 1.1-2.8-2.8 1.1-2-2.6-.6v-4l2.6-.6-1.1-2 2.8-2.8 2 1.1Z" {...f} />
    <circle cx="12" cy="12" r="3" />
  </>
));
export const SearchNormal1 = make("SearchNormal1", ({ f }) => (
  <>
    <circle cx="11" cy="11" r="7" {...f} />
    <path d="M20.5 20.5 16 16" />
  </>
));
export const Flag = make("Flag", ({ f }) => (
  <>
    <path d="M5.5 21V4" />
    <path d="M5.5 4.5H17l-2.5 4 2.5 4H5.5" {...f} />
  </>
));
export const CloudCross = make("CloudCross", ({ f }) => (
  <>
    <path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.8a4.3 4.3 0 0 1-.5 8.7Z" {...f} />
    <path d="M10 11.5l4 4M14 11.5l-4 4" />
  </>
));
export const Book1 = make("Book1", ({ f }) => (
  <>
    <path d="M12 6.4C9.8 4.9 6.6 4.4 3 4.8v13.6c3.6-.4 6.8.1 9 1.6 2.2-1.5 5.4-2 9-1.6V4.8c-3.6-.4-6.8.1-9 1.6Z" {...f} />
    <path d="M12 6.4V20" />
  </>
));
export const Slash = make("Slash", ({ f }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <path d="M5.6 5.6l12.8 12.8" />
  </>
));
export const Forbidden = Slash;
export const Logout = make("Logout", () => out);
export const LogoutCurve = Logout;
export const Location = make("Location", ({ f }) => (
  <>
    <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11Z" {...f} />
    <circle cx="12" cy="10" r="2.4" />
  </>
));
export const Hospital = make("Hospital", ({ f }) => (
  <>
    <rect x="4" y="6.5" width="16" height="14" rx="2.5" {...f} />
    <path d="M9 20.5v-4h6v4M12 9v5M9.5 11.5h5M9 6.5v-3h6v3" />
  </>
));
export const Eye = make("Eye", ({ f }) => eye(f));
export const EyeSlash = make("EyeSlash", ({ f }) => (
  <>
    {eye(f)}
    <path d="M4 4l16 16" />
  </>
));
export const Card = make("Card", ({ f }) => (
  <>
    <rect x="2.8" y="5.5" width="18.4" height="13" rx="3" {...f} />
    <path d="M2.8 10h18.4M6.5 15h4" />
  </>
));

export const Chart = make("Chart", () => <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />);
export const Menu = make("Menu", () => <path d="M4 6h16M4 12h16M4 18h16" />);
export const Bank = make("Bank", ({ f }) => (
  <>
    <path d="M3.5 9.5 12 4l8.5 5.5Z" {...f} />
    <path d="M3.5 9.5h17M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8M3 20h18" />
  </>
));
export const Export = make("Export", () => <path d="M12 14.5v-11M8 7.5l4-4 4 4M4.5 13v3.5A3.5 3.5 0 0 0 8 20h8a3.5 3.5 0 0 0 3.5-3.5V13" />);
export const Moon = make("Moon", ({ f }) => <path d="M20 14.6A8.5 8.5 0 0 1 9.4 4a8.5 8.5 0 1 0 10.6 10.6Z" {...f} />);
export const Sun1 = make("Sun1", ({ f }) => (
  <>
    <circle cx="12" cy="12" r="4.2" {...f} />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </>
));
export const Translate = make("Translate", ({ f }) => (
  <>
    <rect x="2.8" y="3.5" width="11" height="11" rx="2.5" {...f} />
    <path d="M5.5 7h5.6M8.3 7c0 2.4-1.2 4.2-2.8 5.2M7.6 9.6c.8 1 1.9 1.8 3.2 2.2M13 20.5l3.5-8.5 3.5 8.5M14.2 17.7h4.6" />
  </>
));
export const UserTag = make("UserTag", ({ f }) => (
  <>
    <path d="M7 3.5h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2.5L12 21.5 9.5 19.5H7a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3Z" {...f} />
    <circle cx="12" cy="9.3" r="2.5" />
    <path d="M7.8 15.8a4.6 4.6 0 0 1 8.4 0" />
  </>
));

/* react-icons/md names the auth and onboarding screens used (default size 1em, like react-icons). */
export const MdArrowBack = make("MdArrowBack", () => arrowLeft, "1em");
export const MdArrowForward = make("MdArrowForward", () => arrowRight, "1em");
export const MdChevronLeft = make("MdChevronLeft", () => <path d="M14.5 6l-6 6 6 6" />, "1em");
export const MdChevronRight = make("MdChevronRight", () => <path d="M9.5 6l6 6-6 6" />, "1em");
export const MdCheck = make("MdCheck", () => <path d="M5 12.5l4.5 4.5L19 7.5" />, "1em");
export const MdClose = make("MdClose", () => <path d="M6 6l12 12M18 6 6 18" />, "1em");
export const MdSend = make("MdSend", ({ f }) => (
  <>
    <path d="M4 11.5 20 4l-6.5 16-2.6-6.9Z" {...f} />
    <path d="M10.9 13.1 20 4" />
  </>
), "1em");
export const MdLogin = make("MdLogin", () => (
  <>
    <path d="M14.5 4.5H17a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2.5" />
    <path d="M10 7.5l4.5 4.5L10 16.5M14.5 12H4" />
  </>
), "1em");

/* ── More Vitaway icons (24 Nov 2026) for the website, booking and pre-registration screens, which
   used lucide-react / react-icons. Same grid, strokes and Bold tint as the set above. ─────────── */
export const Building = make("Building", ({ f }) => (
  <>
    <rect x="4.5" y="3.5" width="10" height="17" rx="2" {...f} />
    <path d="M14.5 9.5h3a2 2 0 0 1 2 2v9M3 20.5h18M8 7.5h3M8 11h3M8 14.5h3M11 20.5v-2.5H8v2.5" />
  </>
));
export const QuestionCircle = make("QuestionCircle", ({ f, dot }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.1-2.4 3.6" />
    {dot(12, 17, 1.2)}
  </>
));
export const Graduation = make("Graduation", ({ f }) => (
  <>
    <path d="M12 4.5 2.5 9.2 12 14l9.5-4.8Z" {...f} />
    <path d="M6.5 11.3v4.4c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.4M21.5 9.2v5.3" />
  </>
));
export const Handshake = make("Handshake", ({ f }) => (
  <>
    <path d="M2.5 7.5 6 6l4 1.5 3-1.5 5 1.5 3.5-1.5v8l-4.5 3.5-5 2-6.5-5.5-2.5-1Z" {...f} />
    <path d="M13 6l-3.6 3.1a1.4 1.4 0 0 0 1.9 2l2.2-1.6 4.4 4.3M8.6 15.2l2 1.8M11 13.4l2.4 2.1" />
  </>
));
export const HeartHand = make("HeartHand", ({ f }) => (
  <>
    <path d="M12 12.2 9.1 9.4a1.9 1.9 0 0 1 2.9-2.4 1.9 1.9 0 0 1 2.9 2.4Z" {...f} />
    <path d="M2.5 14.5 6 13.2c1-.4 2.1-.3 3 .2l2.2 1.2h2.8a1.6 1.6 0 0 1 0 3.2H10.5M14.6 17.2l4.2-2.1a1.6 1.6 0 0 1 2 2.4l-4.8 3.2c-.8.5-1.8.7-2.7.5L6 19.8H2.5" />
  </>
));
export const Grid = make("Grid", ({ f }) => (
  <>
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" {...f} />
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" {...f} />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" {...f} />
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" {...f} />
  </>
));
export const More = make("More", ({ dot }) => (
  <>
    {dot(5.5, 12, 1.7)}
    {dot(12, 12, 1.7)}
    {dot(18.5, 12, 1.7)}
  </>
));
export const Truck = make("Truck", ({ f }) => (
  <>
    <path d="M2.5 6.5a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v10.5H2.5Z" {...f} />
    <path d="M15 9h3.3l3.2 3.8V17H15" />
    <circle cx="7" cy="17.5" r="2" fill="var(--vc-surface, #fff)" />
    <circle cx="17.5" cy="17.5" r="2" fill="var(--vc-surface, #fff)" />
  </>
));
export const Store = make("Store", ({ f }) => (
  <>
    <path d="M4.5 10.5v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-8" {...f} />
    <path d="M3 8.2 4.8 4h14.4L21 8.2a2.6 2.6 0 0 1-4.5 1.6 2.9 2.9 0 0 1-4.5 0 2.9 2.9 0 0 1-4.5 0A2.6 2.6 0 0 1 3 8.2ZM9.5 20.5v-5h5v5" />
  </>
));
export const Bowl = make("Bowl", ({ f, c }) => (
  <>
    <path d="M3 11.5h18a9 8 0 0 1-18 0Z" {...f} />
    <path d="M8 19.5h8M7.5 11.5c0-2 1.4-3.5 3.2-3.5M13.8 11.5c.2-2.7 2.2-4.8 4.9-5" />
    <circle cx="11" cy="6" r="1.6" fill={c} fillOpacity={0.25} />
  </>
));
export const Target = make("Target", ({ f, dot }) => (
  <>
    <circle cx="12" cy="12" r="9" {...f} />
    <circle cx="12" cy="12" r="5" />
    {dot(12, 12, 1.6)}
  </>
));
export const ChatSquare = make("ChatSquare", ({ f }) => (
  <>
    <path d="M4 6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3V14a3 3 0 0 1-3 3h-5l-4.5 3.5V17H7a3 3 0 0 1-3-3Z" {...f} />
    <path d="M8.5 9h7M8.5 12.5h4.5" />
  </>
));
export const Sunrise = make("Sunrise", ({ f }) => (
  <>
    <path d="M7.5 16.5a4.5 4.5 0 0 1 9 0Z" {...f} />
    <path d="M2.5 16.5h19M5 20h14M12 3.5v5M9.5 6l2.5-2.5L14.5 6M4.6 11.6l1.4 1M19.4 11.6l-1.4 1" />
  </>
));
export const Sunset = make("Sunset", ({ f }) => (
  <>
    <path d="M7.5 16.5a4.5 4.5 0 0 1 9 0Z" {...f} />
    <path d="M2.5 16.5h19M5 20h14M12 3.5v5M9.5 6l2.5 2.5L14.5 6M4.6 11.6l1.4 1M19.4 11.6l-1.4 1" />
  </>
));
export const Dumbbell = make("Dumbbell", ({ f }) => (
  <>
    <rect x="4.5" y="6.5" width="3.5" height="11" rx="1.5" {...f} />
    <rect x="16" y="6.5" width="3.5" height="11" rx="1.5" {...f} />
    <path d="M8 12h8M2.5 9.5v5M21.5 9.5v5" />
  </>
));
export const Briefcase = make("Briefcase", ({ f }) => (
  <>
    <rect x="3" y="7" width="18" height="13" rx="3" {...f} />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M12 11.5v2" />
  </>
));
export const Utensils = make("Utensils", ({ f }) => (
  <>
    <path d="M6.5 3v6.5M4 3v4.5a2.5 2.5 0 0 0 5 0V3M6.5 10v11" />
    <path d="M17.5 21V3c-2.2 1.1-3.5 3.6-3.5 7v3.5h3.5" {...f} />
  </>
));
export const Battery = make("Battery", ({ f }) => (
  <>
    <rect x="2.5" y="7" width="17" height="10" rx="2.5" />
    <path d="M21.5 10.5v3" />
    <rect x="5" y="9.5" width="12" height="5" rx="1" fill="currentColor" fillOpacity={f.fillOpacity ? 0.75 : 0.55} stroke="none" />
  </>
));
export const Bike = make("Bike", () => (
  <>
    <circle cx="5.5" cy="16.5" r="3.5" />
    <circle cx="18.5" cy="16.5" r="3.5" />
    <path d="M5.5 16.5 9 9.5h6.5l3 7M9 9.5l3.5 7h-7M13.8 6h2.4l-.7 3.5" />
  </>
));
export const Brain = make("Brain", ({ f }) => (
  <>
    <path d="M12 5.2a3.1 3.1 0 0 0-5.6 1.3 3.2 3.2 0 0 0-2.1 5 3.3 3.3 0 0 0 1.5 5.1A3.2 3.2 0 0 0 12 18.8ZM12 5.2a3.1 3.1 0 0 1 5.6 1.3 3.2 3.2 0 0 1 2.1 5 3.3 3.3 0 0 1-1.5 5.1A3.2 3.2 0 0 1 12 18.8Z" {...f} />
    <path d="M12 5.2v13.6M8.5 10.5c1.3 0 2 .6 2 1.8M15.5 10.5c-1.3 0-2 .6-2 1.8" />
  </>
));
export const Sparkles = make("Sparkles", ({ f }) => (
  <>
    <path d="M10 3.5 11.6 8l4.4 1.6-4.4 1.6L10 15.7l-1.6-4.5L4 9.6 8.4 8Z" {...f} />
    <path d="M17.5 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" {...f} />
  </>
));
