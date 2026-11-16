import Link from "next/link";
import { PhoneCall, MessageCircle, MapPin, Mail, ShieldCheck, ArrowRight, Clock, Award } from "lucide-react";

export default function ArticleConversionSection() {
  return (
    <section className="my-16 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-navy via-[#01283d] to-[#011c2c] p-8 text-white shadow-xl sm:p-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-paste/30 bg-white/10 px-3.5 py-1 text-xs font-bold text-paste">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Trusted Waterproofing Specialists Since 2009</span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-white">
            Protect Your Building with Bangladesh&apos;s Premier Waterproofing Engineers
          </h2>

          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Don&apos;t wait for monsoon moisture to weaken reinforcement steel and damage ceilings. Contact Enviro Shield Pvt. Ltd. today for an engineered, multi-layer waterproofing solution customized to your roof slab.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-paste shrink-0" aria-hidden="true" />
              <span>Complimentary On-Site Diagnosis</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-paste shrink-0" aria-hidden="true" />
              <span>Long-Term Material & Work Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-paste shrink-0" aria-hidden="true" />
              <span>Advanced Non-Destructive Leak Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-paste shrink-0" aria-hidden="true" />
              <span>Climate-Tailored Multi-Layer Formulations</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <span className="text-xs font-bold uppercase tracking-wider text-paste">
            Immediate Response Hotline
          </span>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            01613220101
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Direct access to senior waterproofing project coordinators.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="tel:01613220101"
              className="flex items-center justify-center gap-2.5 rounded-xl bg-blue py-3.5 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span>Call 01613220101 Now</span>
            </a>

            <a
              href="https://wa.me/8801613220101?text=Hello%20Enviro%20Shield,%20I%20would%20like%20to%20request%20a%20roof%20waterproofing%20inspection."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/10 py-3 text-center text-sm font-bold text-white transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>Message on WhatsApp</span>
            </a>

            <Link
              href="/contact"
              className="group flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <span>Or submit an enquiry through our contact form</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-paste shrink-0" aria-hidden="true" />
              <a href="mailto:enviroshield.bd@gmail.com" className="hover:underline">
                enviroshield.bd@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-paste shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                House #13~15, Road # 22, Block # B, Bauniabad R/A, Mirpur-11, Dhaka., Mirpur, Bangladesh, 1216
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

