import { Mail, MapPin, Phone } from "lucide-react";

export default function TopHeaderBar() {
  return (
    <div className="hidden h-[38px] border-b border-[#e9eef1] bg-white text-[13px] text-ink min-[901px]:block">
      <div className="container flex h-full items-center justify-between">
        <span className="flex items-center gap-[7px] font-normal">
          <MapPin size={14} />
          Serving homes and businesses with care
        </span>

        <span className="flex items-center gap-6">
          <a
            href="mailto:hello@enviroshield.com"
            className="flex items-center gap-[7px]"
          >
            <Mail size={14} />
            hello@enviroshield.com
          </a>

          <a
            href="tel:+11234567890"
            className="flex items-center gap-[7px]"
          >
            <Phone size={14} />
            +1 123 456 7890
          </a>
        </span>
      </div>
    </div>
  );
}
