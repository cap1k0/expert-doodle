import TrustBox from "./TrustBox";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-black/10 py-12">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-6 text-black/45">
            Research, experiments and ideas on AI, language and bias.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <TrustBox variant="micro" className="w-56" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/40">
            <span>© {new Date().getFullYear()} Bruca</span>
            <a href="https://bruca.space" className="hover:text-black">
              bruca.space
            </a>
            <a
              href="https://www.trustpilot.com/review/bruca.space"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black"
            >
              Trustpilot
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
