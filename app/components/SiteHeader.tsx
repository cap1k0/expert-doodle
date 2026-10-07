import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 -mx-5 border-b border-black/10 bg-[#f7f7f5]/80 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
      <nav className="flex items-center justify-between py-4">
        <Link href="/" aria-label="Bruca Journal home">
          <Logo />
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="https://bruca.space"
            className="hidden text-sm text-black/50 transition-colors hover:text-black sm:block"
          >
            Main site
          </a>
          <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium">
            Journal
          </span>
        </div>
      </nav>
    </header>
  );
}
