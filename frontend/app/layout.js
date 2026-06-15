import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Edu Sphare — Modern School Management System",
    template: "%s | Edu Sphare",
  },
  description:
    "A comprehensive, production-ready school management platform for students, teachers, administrators, and finance teams.",
  keywords: ["school management", "education portal", "student dashboard", "academic performance"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans antialiased">
        <Script
          id="theme-toggle-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('edu-sphare-theme') || 'system';
                  var language = localStorage.getItem('edu-sphare-language') || 'en';
                  var root = document.documentElement;
                  root.lang = language;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <LanguageProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="edu-sphare-theme"
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

