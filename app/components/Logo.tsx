export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline text-xl font-semibold tracking-[-0.04em] ${className}`}
    >
      Bruca
      <span className="text-blue-600">.</span>
    </span>
  );
}
