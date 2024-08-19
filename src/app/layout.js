import { GoogleAnalytics } from "@next/third-parties/google";
import Notify from "@/components/notify";
import "./globals.css";

export const metadata = {
  title: "Healing Waves: A Lo-FI Afrobeats Journey",
  description: "A Lo-FI Afrobeats Journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-bg pb-0 text-dark bg-cover text-base pt-5 min-h-full leading-6 md:pt-2">
        <Notify />
        {children}
      </body>
      <GoogleAnalytics gaId="G-PRHE6GZQ9K" />
    </html>
  );
}
