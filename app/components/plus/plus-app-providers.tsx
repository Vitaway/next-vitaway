"use client";

import { PlusAuthProvider } from "@/lib/plus/auth-context";
import { LanguageProvider } from "@/lib/plus/i18n";
import { NavigationTracker } from "@/lib/plus/nav";
import { PlusPathsProvider } from "@/lib/plus/plus-paths";
import { ThemeProvider, useTheme } from "@/lib/plus/theme";
import InstallPrompt from "./install-prompt";
import ServiceWorkerRegister from "./service-worker-register";
import { DocumentReaderProvider } from "./ui/document-reader";
import { FeedbackProvider } from "./ui/vita";

function VitaRoot({ children }: { children: React.ReactNode }) {
  const { dark } = useTheme();
  return (
    <div className="vita-root" data-theme={dark ? "dark" : "light"}>
      <div className="vita-column">{children}</div>
    </div>
  );
}

export default function PlusAppProviders({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <PlusPathsProvider basePath={basePath}>
      <ThemeProvider>
        <LanguageProvider>
          <PlusAuthProvider>
            <VitaRoot>
              <FeedbackProvider>
                <DocumentReaderProvider>
                  <NavigationTracker />
                  <ServiceWorkerRegister />
                  {children}
                  <InstallPrompt />
                </DocumentReaderProvider>
              </FeedbackProvider>
            </VitaRoot>
          </PlusAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </PlusPathsProvider>
  );
}
