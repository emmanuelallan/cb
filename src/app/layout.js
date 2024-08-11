import Notify from "@/components/notify";
import "./globals.css";

export const metadata = {
  title: "Healing Waves",
  description: "A Lo-FI Afrobeats Journey",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-bg pb-0 text-dark bg-cover text-base pt-5 min-h-full leading-6">
        <Notify />
        {children}
      </body>
    </html>
  );
}
