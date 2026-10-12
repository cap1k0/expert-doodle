"use client";

import { useState } from "react";

type Coin = {
  id: "eth" | "sol" | "trx" | "btc";
  name: string;
  network: string;
  address: string;
  color: string;
  icon: React.ReactNode;
};

const COINS: Coin[] = [
  {
    id: "eth",
    name: "Ethereum",
    network: "ETH · ERC-20",
    address: "0x73D3C420a3d764FC98dD9FCeE02eBcAbde4d7eFc",
    color: "#627EEA",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <path fill="#fff" d="M16 4l-7 12 7 4 7-4z" opacity=".95" />
        <path fill="#fff" d="M9 18l7 10 7-10-7 4z" opacity=".8" />
      </svg>
    ),
  },
  {
    id: "sol",
    name: "Solana",
    network: "SOL",
    address: "AAayhqzLdbyXwiyFHRvHKQ8YupBWoVwCojsuXyig8QY4",
    color: "#14F195",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <path fill="#111" d="M9 9h16l-2.5 3H6.5zM6.5 14.5h16l2.5 3H9zM9 20h16l-2.5 3H6.5z" />
      </svg>
    ),
  },
  {
    id: "trx",
    name: "Tron",
    network: "TRX · TRC-20",
    address: "TXneyJxTK4VZRcvcRYRAv96tZHyHGAahaH",
    color: "#EB0029",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <path fill="#fff" d="M7 8l17 3.5-8.5 14zm3.5 2.5l5 11 5.5-9z" fillRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "btc",
    name: "Bitcoin",
    network: "BTC · SegWit",
    address: "bc1qp3mnrvz39pvpgnmqz3nvn56gts968s4u0gyfrd",
    color: "#F7931A",
    icon: (
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <path
          fill="#fff"
          d="M20.5 14.3c.8-.5 1.3-1.3 1.2-2.4-.2-1.6-1.5-2.1-3.2-2.3V7.5h-1.4v2c-.4 0-.7 0-1.1.1V7.5h-1.4v2.1h-2.8v1.5s1 0 1 0c.6 0 .7.3.7.6v6.4c0 .2-.1.5-.5.5H11l-.3 1.7h2.7v2.2h1.4v-2.1h1.1v2.1h1.4v-2.2c2.3-.1 3.9-.7 4.1-2.8.2-1.7-.6-2.4-1.9-2.7zM15.1 11.3c.8 0 3.3-.2 3.3 1.1 0 1.2-2.5 1.1-3.3 1.1zm0 7.1v-2.5c1 0 4-.2 4 1.2 0 1.4-3 1.3-4 1.3z"
        />
      </svg>
    ),
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/60 transition hover:border-black hover:text-black"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}

export default function DonateSection() {
  return (
    <section id="donate" className="border-t border-black/10 pt-12">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
          Donate
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
          Help our developers bring more people into this fair community.
        </h2>
        <p className="mt-3 text-sm leading-6 text-black/50">
          Every contribution goes straight into building and keeping this
          project open. Scan a QR code or copy an address. Double-check the
          network before you send.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COINS.map((c) => (
          <div
            key={c.id}
            className="flex flex-col rounded-2xl border border-black/10 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: c.color }}
              >
                {c.icon}
              </span>
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-black/40">{c.network}</div>
              </div>
            </div>

            <div className="mx-auto mt-5 w-full max-w-[160px] rounded-xl border border-black/10 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/qr/${c.id}.svg`}
                alt={`${c.name} donation QR code`}
                className="aspect-square w-full"
              />
            </div>

            <code className="mt-5 block break-all rounded-lg bg-black/[0.04] px-3 py-2 text-[11px] leading-5 text-black/70">
              {c.address}
            </code>
            <div className="mt-3 flex justify-end">
              <CopyButton text={c.address} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
