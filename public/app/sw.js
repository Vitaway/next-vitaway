/* Vitaway Plus app-shell service worker. Caches a simple offline fallback and shows Web Push alerts. */
const CACHE = "vitaway-plus-shell-v3";
// Dev servers serve unhashed chunks; caching them would pin stale code.
const DEV_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|.+\.local)$/.test(self.location.hostname);
const PREFIX = self.location.pathname.startsWith("/app/") ? "/app" : "";
const OFFLINE_URL = `${PREFIX}/offline`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL);
        return cached || new Response("You are offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
      }),
    );
    return;
  }

  if (DEV_HOST) return;

  if (url.pathname.startsWith("/_next/static/") || /\.(?:png|svg|ico|webp|jpg|jpeg|gif|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});

const ICON = "/web-app-manifest-192x192.png";

// Only pages inside the app; anything else opens the notifications list.
function appPath(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !/[?#\\]/.test(value) ? value : "/notifications";
}

// Web Push from core-backend (care-team alerts and reminders), shown even when the app is closed.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const tag = typeof data.tag === "string" && data.tag ? data.tag : undefined;
  const options = {
    body: typeof data.body === "string" ? data.body : "",
    icon: ICON,
    badge: ICON,
    data: { url: `${PREFIX}${appPath(data.path)}` },
    silent: data.silent === true,
    ...(tag ? { tag, renotify: true } : {}),
    ...(data.vibrate === false || data.silent === true ? {} : { vibrate: [200, 100, 200] }),
  };
  event.waitUntil(self.registration.showNotification(typeof data.title === "string" && data.title ? data.title : "Vitaway", options));
});

// The browser rotated the subscription: renew it now; the app saves the new one on its next open.
self.addEventListener("pushsubscriptionchange", (event) => {
  const options = event.oldSubscription && event.oldSubscription.options;
  if (!options || !options.applicationServerKey) return;
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: options.applicationServerKey }).catch(() => undefined),
  );
});

// Tapping a notification focuses the app (or opens it) on the page it points to.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || `${PREFIX}/home`, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (new URL(client.url).origin === self.location.origin && "focus" in client) {
          return client.focus().then((focused) => (focused && "navigate" in focused ? focused.navigate(target) : focused));
        }
      }
      return self.clients.openWindow ? self.clients.openWindow(target) : undefined;
    }),
  );
});
