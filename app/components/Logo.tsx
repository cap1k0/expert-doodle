export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="10" className="fill-blue-600" />
        <ellipse
          cx="13"
          cy="13"
          rx="12"
          ry="4"
          fill="none"
          className="stroke-blue-600"
          strokeWidth={1.5}
          transform="rotate(-18 13 13)"
        />
      </svg>
      <span className="text-lg font-medium">Bruca</span>
    </div>
  );
}
