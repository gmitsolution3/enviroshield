import { images } from "@/lib/data/content";
import { Check } from "lucide-react";
import Image from "next/image";
import { AnimatedCounter } from "../animations/animated-counter";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

// Swap these with the exact photos from your design.
const aboutImages = {
  wallpaper: {
    src: "https://images.pexels.com/photos/7546771/pexels-photo-7546771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Hand peeling floral wallpaper off a wall",
  },
  inspection: {
    src: images.painter,
    alt: "Two professionals inspecting a prepared wall",
  },
  ladder: {
    src: "https://images.pexels.com/photos/6764289/pexels-photo-6764289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Workers finishing a ceiling from a ladder",
  },
};

const avatars = [
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=33",
  "https://i.pravatar.cc/80?img=47",
  "https://i.pravatar.cc/80?img=45",
];

const photoClass =
  "group relative h-[270px] overflow-hidden rounded-[18px] max-[600px]:h-[170px]";
const imgClass =
  "object-cover transition-transform duration-[0.6s] group-hover:scale-[1.04]";

export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      <Container className="grid grid-cols-2 items-center gap-24 max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        {/* ---------- Left: image collage ---------- */}
        <Reveal dir="image">
          <div className="grid grid-cols-2 gap-5 max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[580px] max-[600px]:gap-3">
            {/* left column (offset down) */}
            <div className="flex flex-col gap-[27px] pt-[70px] max-[600px]:gap-3 max-[600px]:pt-10">
              <div className={photoClass}>
                <Image
                  src={aboutImages.wallpaper.src}
                  alt={aboutImages.wallpaper.alt}
                  fill
                  sizes="(max-width: 900px) 45vw, 25vw"
                  className={imgClass}
                />
              </div>

              <div className="flex h-[128px] flex-col items-center justify-center gap-2 rounded-[18px] bg-mist max-[600px]:h-[100px]">
                <div className="flex items-center">
                  {avatars.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className={`h-[42px] w-[42px] rounded-full border-2 border-white bg-white object-cover max-[600px]:h-9 max-[600px]:w-9 ${
                        i > 0 ? "-ml-2.5" : ""
                      }`}
                    />
                  ))}
                  <span
                    className="-ml-2.5 grid h-[42px] w-[42px] place-items-center rounded-full border-2 border-white bg-blue text-[22px] leading-none text-white max-[600px]:h-9 max-[600px]:w-9"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
                <span className="text-[15px] text-ink">
                  Happy Customer
                </span>
              </div>
            </div>

            {/* right column */}
            <div className="flex flex-col gap-[27px] max-[600px]:gap-3">
              <div className={photoClass}>
                <Image
                  src={aboutImages.inspection.src}
                  alt={aboutImages.inspection.alt}
                  fill
                  sizes="(max-width: 900px) 45vw, 25vw"
                  className={imgClass}
                />
              </div>
              <div className={photoClass}>
                <Image
                  src={aboutImages.ladder.src}
                  alt={aboutImages.ladder.alt}
                  fill
                  sizes="(max-width: 900px) 45vw, 25vw"
                  className={imgClass}
                />
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeader
            eyebrow="ABOUT US"
            title="We don’t just paint walls. We transform spaces."
            text="At Enviroshield, we believe walls are more than surfaces. They are opportunities to express personality, comfort, and style. Our team combines professional craftsmanship with thoughtful design to create spaces that feel truly yours."
            headingId="about-heading"
          />

          <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
            {[
              "Your Vision Our Expertise",
              "Your Space Is Our Inspiration",
              "Walls Are Our Canvas",
              "Beautiful Walls, Built on Trust",
              "24/7 Availability",
              "Passionate About Quality",
            ].map((item) => (
              <StaggerItem
                key={item}
                className="flex items-center gap-2 text-[15px] font-medium text-navy"
              >
                <span
                  className="grid h-5 w-5 flex-none place-items-center rounded-full bg-navy text-white"
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={3.5} />
                </span>
                {item}
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mb-7 flex gap-[54px] border-t border-line pt-6 max-[600px]:gap-[30px]">
            <div>
              <strong className="block text-[34px] tracking-[-0.04em] text-navy max-[600px]:text-[28px]">
                <AnimatedCounter value={99} suffix="%" />
              </strong>
              <span className="text-[12px] text-ink">
                Customer satisfaction
              </span>
            </div>

            <div>
              <strong className="block text-[34px] tracking-[-0.04em] text-navy max-[600px]:text-[28px]">
                <AnimatedCounter value={500} suffix="+" />
              </strong>
              <span className="text-[12px] text-ink">
                Projects completed
              </span>
            </div>
          </div>

          <Button href="/about" variant="outline">
            More about us
          </Button>
        </div>
      </Container>
    </section>
  );
}
