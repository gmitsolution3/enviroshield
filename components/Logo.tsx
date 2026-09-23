import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`logo flex items-center gap-2.5 ${light ? "logo-light" : ""}`}
    >
      <Image
        src="/images/logo.png"
        alt="Enviroshield Logo"
        width={100}
        height={100}
        className="w-18 h-auto"
      />
      <span
        style={{
          color: light ? "#fff" : "var(--blue)",
          fontWeight: 700,
          fontSize: "1.25rem",
          letterSpacing: "-0.02em",
          position: "relative",
        }}
      >
        EnviroShield
        <span
          style={{
            color: light ? "#fff" : "var(--ink)",
            fontWeight: 600,
            fontSize: ".8rem",
            letterSpacing: "-0.02em",
            position: "absolute",
            display: "block",
            bottom: light ? "-15px" : "-10px",
            right: 0,
          }}
        >
          Pvt. Ltd.
        </span>
      </span>
    </Link>
  );
}
