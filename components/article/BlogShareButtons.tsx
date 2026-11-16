"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type BlogShareButtonsProps = {
  title: string;
  defaultUrl: string;
};

export default function BlogShareButtons({
  title,
  defaultUrl,
}: BlogShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-ink/60">
        <Share2 size={14} aria-hidden="true" />
        Share
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-bold text-navy transition-colors hover:text-blue"
        >
          {link.label}
        </a>
      ))}

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs font-semibold text-navy transition-colors hover:border-blue/30 hover:bg-blue/10 hover:text-blue"
        aria-label="Copy article link"
      >
        {copied ? (
          <>
            <Check size={12} className="text-emerald-600" />
            <span className="text-emerald-700">Copied</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
