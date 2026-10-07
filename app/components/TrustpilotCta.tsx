import TrustBox from "./TrustBox";

const REVIEW_URL =
  process.env.NEXT_PUBLIC_TP_REVIEW_URL ||
  "https://www.trustpilot.com/evaluate/bruca.space";

const hasCarousel =
  !!process.env.NEXT_PUBLIC_TP_BUSINESS_ID &&
  !!process.env.NEXT_PUBLIC_TP_TEMPLATE_CAROUSEL;

export default function TrustpilotCta() {
  return (
    <div className="space-y-6">
      {/* REVIEWS CAROUSEL (only renders when the env vars are set) */}
      {hasCarousel && (
        <section className="rounded-[2rem] border border-black/10 bg-white p-6 sm:p-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
                Reviews
              </p>
              <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                What people say about Bruca
              </h3>
            </div>
          </div>
          <TrustBox variant="carousel" theme="light" />
        </section>
      )}

      {/* REVIEW CTA */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#111] p-8 text-white sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(37,99,235,0.35),transparent_55%)]" />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Your opinion counts
            </p>
            <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
              Enjoyed Bruca? Tell others on Trustpilot.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/55">
              An honest review takes a minute and helps other people decide
              if Bruca is right for them.
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 sm:items-end">
            <TrustBox variant="micro" theme="dark" className="w-full sm:w-64" />
            <a
              href={REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
            >
              <span className="text-[#00b67a]">★</span>
              Review us on Trustpilot
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
