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
