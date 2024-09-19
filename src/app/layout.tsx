import { ThemeProvider } from "@/components/themeProvider";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { brandName, landingPageDescription } from "@/config";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s - ${brandName}`,
    default: brandName,
  },
  description: landingPageDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} bg-bg antialiased dark:bg-darkBg dark:text-darkText`}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
