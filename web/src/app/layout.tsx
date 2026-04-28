import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { I18nProvider } from "@/i18n/I18nContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RouteProgress } from "@/components/RouteProgress";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beshqozon — stolni onlayn bron qilish",
  description:
    "Beshqozon restoranlarida stolni onlayn bron qiling: filialni tanlang, sana va vaqtni tanlang, ko'ngildagi stolni xaritadan tanlang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="antialiased">
        <AuthProvider>
          <I18nProvider>
            <RouteProgress />
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
