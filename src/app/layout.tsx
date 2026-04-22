import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import TopNav from "@/components/TopNav";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Generator",
  description: "Generate and optimize your resume with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = cookies().get("locale")?.value;
  const initialLocale = locale === "zh" || locale === "en" ? locale : "en";
  return (
    <html lang={initialLocale}>
      <body className={inter.className}>
        <I18nProvider initialLocale={initialLocale}>
          <TopNav />
          <div className="min-h-[calc(100vh-56px)]">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}
