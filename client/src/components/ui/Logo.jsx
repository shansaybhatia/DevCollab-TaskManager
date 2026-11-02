export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="48" height="48" rx="12" fill="#e0e7ff" />
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="11.5"
        stroke="#c7d2fe"
      />
      <path
        d="M12 14h10c6.627 0 12 5.373 12 12s-5.373 12-12 12H12V14z"
        stroke="#818cf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 19h6c3.866 0 7 3.134 7 7s-3.134 7-7 7h-6V19z"
        fill="rgba(99, 102, 241, 0.15)"
        stroke="#4f46e5"
        strokeWidth="2"
      />
      <circle cx="22" cy="26" r="3.5" fill="#f59e0b" />
      <path
        d="M28 17l6 9-6 9"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
