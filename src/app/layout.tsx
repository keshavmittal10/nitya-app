import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nitya — Daily Spiritual Companion",
  description: "Your daily Vedic spiritual companion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, background: "#080410", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
