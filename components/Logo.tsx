import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`relative inline-flex items-center gap-2.5 ${
        light ? "text-white" : "text-blue"
      }`}
      aria-label="Enviroshield Logo"
    >
      <Image
        src="/images/logo.png"
        alt="Enviroshield Logo"
        width={100}
        height={100}
        className="h-auto w-18"
      />

      <span className="relative text-[1.25rem] font-bold tracking-[-0.02em]">
        EnviroShield
        <span
          className={`absolute right-0 block text-[0.8rem] font-semibold tracking-[-0.02em] ${
            light ? "text-white" : "text-ink"
          } ${light ? "bottom-[-15px]" : "bottom-[-10px]"}`}
        >
          Pvt. Ltd.
        </span>
      </span>
    </Link>
  );
}
