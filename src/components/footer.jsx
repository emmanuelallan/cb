export default function Footer() {
  return (
    <footer className="bg-card rounded-lg p-4 md:w-full md:m-auto mb-6 md:max-w-[518px] mx-auto px-0 large:max-w-[990px] large:w-full">
      <p className="text-center">
        All rights reserved &copy; {new Date().getFullYear()}. Made with 💚 by
        Emmanuel Allan
      </p>
    </footer>
  );
}
