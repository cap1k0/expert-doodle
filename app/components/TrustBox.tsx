"use client";

import { useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (el: HTMLElement, force?: boolean) => void;
    };
  }
}

const TEMPLATES = {
  micro: process.env.NEXT_PUBLIC_TP_TEMPLATE_MICRO,
  mini: process.env.NEXT_PUBLIC_TP_TEMPLATE_MINI,
  collector: process.env.NEXT_PUBLIC_TP_TEMPLATE_COLLECTOR,
} as const;

const HEIGHTS = { micro: "24px", mini: "150px", collector: "52px" } as const;

type Props = {
  variant?: keyof typeof TEMPLATES;
  theme?: "light" | "dark";
  className?: string;
};

export default function TrustBox({
  variant = "micro",
  theme = "light",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const businessId = process.env.NEXT_PUBLIC_TP_BUSINESS_ID;
  const templateId = TEMPLATES[variant];
  const token = process.env.NEXT_PUBLIC_TP_TOKEN;
  const profileUrl =
    process.env.NEXT_PUBLIC_TP_PROFILE_URL ||
    "https://www.trustpilot.com/review/bruca.space";

  if (!businessId || !templateId) return null;

  const init = () => {
    if (ref.current) window.Trustpilot?.loadFromElement(ref.current, true);
  };

  return (
    <>
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
        onReady={init}
      />
      <div
        ref={ref}
        className={`trustpilot-widget ${className ?? ""}`}
        data-locale="en-US"
        data-template-id={templateId}
        data-businessunit-id={businessId}
        data-style-height={HEIGHTS[variant]}
        data-style-width="100%"
        data-theme={theme}
        {...(token ? { "data-token": token } : {})}
      >
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
          Trustpilot
        </a>
      </div>
    </>
  );
}
