type SocialIconName = "instagram" | "linkedin" | "facebook" | string;

type SocialIconProps = {
  name: SocialIconName;
  size?: number;
};

export default function SocialIcon({
  name,
  size = 16,
}: SocialIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg {...common}>
        <path
          d="M5 9H8V19H5V9ZM6.5 4.5A1.75 1.75 0 1 0 6.5 8a1.75 1.75 0 0 0 0-3.5ZM10 9h2.9v1.4h.05A3.2 3.2 0 0 1 15.8 8.8c3 0 3.6 2 3.6 4.6V19h-3v-5c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V19h-3V9Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M13.5 21V13.1h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V10H7.7v3.1h2.7V21h3.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
