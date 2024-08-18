import Link from "next/link";

export default function Footer() {
  return (
    <footer className="md:w-full md:py-0 md:px-2.5">
      <div className="bg-card rounded-3xl p-6 md:w-full md:m-auto mb-6 md:max-w-[518px] mx-auto px-0 large:max-w-[990px] large:w-full">
        <p className="text-center">
          All rights reserved &copy; {new Date().getFullYear()}. Made with 💚 by{" "}
          <Link
            href="https://emmanuelallan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Emmanuel Allan
          </Link>
        </p>
      </div>
    </footer>
  );
}
