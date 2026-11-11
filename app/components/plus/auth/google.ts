/**
 * Google sign-in for the web build. Flutter uses the google_sign_in plugin and
 * posts the token to /auth/google/; on the web we use Google Identity Services'
 * token client with the same backend call. Needs NEXT_PUBLIC_GOOGLE_CLIENT_ID
 * (a Web OAuth client that lists this origin) and GOOGLE_CLIENT_IDS on the API.
 */

type TokenResponse = { access_token?: string; error?: string };
type TokenClient = { requestAccessToken: (options?: { prompt?: string }) => void };
type GoogleAccounts = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: { type?: string }) => void;
      }) => TokenClient;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}

export function googleClientId(): string {
  return (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();
}

let loader: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!loader) {
    loader = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loader = null;
        reject(new Error("network"));
      };
      document.head.appendChild(script);
    });
  }
  return loader;
}

/** Opens the Google account popup; resolves with an access token, or null if cancelled. */
export async function requestGoogleAccessToken(): Promise<string | null> {
  const clientId = googleClientId();
  if (!clientId) throw new Error("not_configured");
  await loadScript();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error("network");
  return new Promise<string | null>((resolve) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (response) => resolve(response.access_token || null),
      error_callback: () => resolve(null),
    });
    client.requestAccessToken({ prompt: "select_account" });
  });
}
