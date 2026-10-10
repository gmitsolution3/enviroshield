import { Mail, MapPin, Phone } from "lucide-react";
import Container from "../Container";

export default function TopHeaderBar() {
  return (
    <div className="hidden h-[38px] border-b border-[#e9eef1] bg-white text-[13px] text-ink min-[901px]:block">
      <Container className="flex h-full items-center justify-between">
        <span className="flex items-center gap-[7px] font-normal">
          <MapPin size={14} aria-hidden="true" />
          House No: 22/13-15, Block-B, Bauniabad R/A, Mirpur 11,
          Pallabi, Dhaka 1216
        </span>

        <span className="flex items-center gap-6">
          <a
            href="mailto:enviroshield.bd@gmail.com"
            className="flex items-center gap-[7px]"
          >
            <Mail size={14} aria-hidden="true" />
            enviroshield.bd@gmail.com
          </a>

          <a
            href="tel:+8801613220101"
            className="flex items-center gap-[7px]"
          >
            <Phone size={14} aria-hidden="true" />
            +8801613220101
          </a>
        </span>
      </Container>
    </div>
  );
}
