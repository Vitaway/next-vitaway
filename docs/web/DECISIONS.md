# Web (desktop) layout decisions

## 22 Nov 2026: top bar web shell

- Phones (under 768px) keep the Flutter look; nothing there changed on purpose. Flutter is the source of truth.
- From 768px the side menu is gone. A sticky top bar holds the logo, the five main tabs, an orange Log button
  (opens the quick-log menu), notifications and an avatar menu with the "Ibindi" items, language and sign out.
- F23 colours (navy #0B2C4D, orange #F47C20, background #F2F4F7, ink #0F1E2C, muted #5A6878) and the League
  Spartan / Manrope fonts apply only from 768px, so phones are untouched. Dark mode keeps its own tokens.
- Pages sit in a 1200px column (dashboards, settings, lists) or 880px (forms and one-item pages), titles
  left-aligned. Columns that used to centre themselves now line up with the title.
- Flat look on web: no bordered cards, inputs are underline fields.
- Home is a two-column dashboard: main sections on the left, a sticky right rail (urgent help, plan,
  question of the day, meal tip, clinic visit).
- One themed dropdown (`ui/select.tsx`, a button + listbox) replaces native selects so the menu follows
  light and dark mode in Safari too.
- `next.config.ts` rewrites the old alias paths (/me, /medications, /notifications, /subscriptions,
  /api/articles, /api/rooms, /api/user-reservations) to the API. Locally these 404'd without it. They are live
  wherever NEXT_PUBLIC_PLUS_API_URL is set, so check before shipping.

## 22 Nov 2026: medicine reminders

- Saving a medicine shows "Reminders set for 08:00 and 20:00"; the medicine page has a reminders switch
  and the Reminders page lists each medicine's times. Times come from the server `reminders` field when
  present, otherwise from the medicine's own times.

## 23 Nov 2026: tablet and web redesign (boss review)

- Colours: the web now uses the phone app's brand colours. Teal #003E48 replaces navy #0B2C4D, and orange
  #E85A2E replaces #F47C20 (nav, primary buttons, badges, accents). Phones are unchanged.
- Navigation (768px and up): a floating orange pill pinned to the top, from the boss's reference. White logo
  disc, icon + label links, a white "+ Log" pill, bell and account menu. Once you scroll, only the pill floats.
- Header band: every page has a teal band behind the nav and the page title, with rounded bottom corners
  (36px on tablet, 48px on desktop). Titles are centred and use Caveat Brush, the same hand-written face as the
  Inzu mobile app's page titles. Chat and the document reader keep their framed light headers.
- Home: the greeting sits centred in the band ("Hello, Name! 👋"). Urgent help and plan cards overlap the band's
  edge, then main column + right rail on desktop and paired cards on tablet.
- Centring: content columns stay centred under the centred titles (the 22 Nov left-align override is gone),
  and save bars / inline buttons are centred.
- Icons: `lib/plus/icons.tsx` replaces iconsax-react and react-icons/md in the PWA with line icons drawn in
  the Inzu TabNavIcon style (24 grid, bold rounded strokes, soft fill when active). Same export names, so
  screens only changed their import. The "play"-looking ArrowRight3 is now a plain arrow.
  `ui/vita-icons.tsx` has the 64-grid tile illustrations (Inzu OptionIllustrations style) used in the Log
  menu, + dial, shortcut tiles and home cards. Small list-row icons stay line icons, as in Inzu.
- Pricing: membership packages are pricing cards (4 across on desktop, 2 on tablet, stacked on phones)
  with the price, billing, and the package's `inclusions` as the feature list. "Best value" goes only to
  the one-payment package with the lowest price per day, so the badge is a fact, not marketing.
- Checkout (`plans/checkout.tsx`, used by /payment and the programme enrolment pay step): total-price card
  with line items, the ways to pay, a security note and one Continue button. The ways to pay (MTN MoMo,
  Airtel Money, card, bank) are shown as what IremboPay accepts, not as choices: the member picks on
  IremboPay's hosted checkout, and the app does not send a method.
- New strings have en + rw; the rw wording needs the native-speaker review like the rest.
- `next.config.ts` rewrites also cover /coaches, /transactions, /progress-notes, /api/visit-reports and
  /api/ehr-meal-plans (they 404'd locally and broke Care Team, find-a-coach, notes, meal plans, payments).
- Modals on phones: every modal, the date picker, the meal-review sheet and the install card open as a centred
  card (20px corners), not a bottom sheet. They render through `RootPortal` (`ui/vita.tsx`) into `.vita-root`,
  because inside a screen they were trapped under the phone tab bar and the Log button. `.vita-root`, not
  document.body, so the theme tokens still apply.
- One page frame on desktop: every page's header (back button, centred title, actions) uses the 1200px frame
  that lines up with the nav pill. "Narrow" pages (forms, single records) keep their content in a centred
  880px column under that header, instead of narrowing the whole page (which moved the back button inward).
- My Health and Nutrition were redesigned the same day: reading cards (value, approved-rule status chip,
  weekly chart, Log new / History) and a share-a-meal card, how-it-works steps and a photo gallery.
- Web top bar tabs use illustrated icons (`NAV_ILLU` in `ui/vita-icons.tsx`: home, health, nutrition, learn,
  care team) in white discs on the orange pill. The phone tab bar keeps the line glyphs.
- Web footer (`shell/web-footer.tsx`, 768px and up): teal band with rounded top corners, App Store and Google
  Play badges using the marketing site's real store URLs (`buttons/store-buttons.tsx`), Privacy / Terms /
  Contact, and "Built by Keyypress" (https://keyypress.com) bottom right. Phones have no footer.

## 23 Nov 2026: Photos are re-encoded to JPEG in the browser before upload
- **Why:** the backend's sharp build decodes HEIF only for AVIF, not iPhone HEIC (HEVC). Safari sends HEIC from the Photos library as-is, so meal photos failed with "We could not read that photo" (shown in the PWA as "Could not send this photo").
- **What:** `lib/plus/upload-image.ts` `prepareImageForUpload` draws HEIC/HEIF, unknown types and files over 4 MB onto a canvas and sends a JPEG (max edge 2400px, quality 0.88). Used by the meal-photo upload, meal recognition and device-photo reading. JPEG/PNG/WebP under 4 MB pass through unchanged. A 400 from the server now shows the server's own reason.
- **Checked:** a HEIC file in Playwright WebKit was uploaded as JPEG and saved (201).
- **Open:** Flutter should do the same if its picker ever returns HEIC.

## 23 Nov 2026: Academy course sidebar v2
- A teal header with a progress ring and "Week N of 12", icon tabs instead of six accordions, and one card per week. Only the current week opens, as a step timeline with the open lesson's pages nested inside. Finished weeks fold to a tick, and locked weeks fold into one "Coming up" list. The same component is used for the phone drawer and the web column (`academy/sidebar.tsx`).
