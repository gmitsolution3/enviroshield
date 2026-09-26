import { images } from "@/lib/data/content";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { AnimatedCounter } from "../animations/animated-counter";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function AboutSection() {
  return (
    <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
      <Container className="grid grid-cols-2 items-center gap-24 max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        <Reveal dir="image">
          <div className="relative grid grid-cols-[1fr_0.9fr] grid-rows-[180px_112px_150px] gap-5 px-[10px] py-2 pr-[10px] max-[900px]:mx-auto max-[900px]:w-full max-[900px]#:max-w-[560px] max-[600px]:grid-rows-[140px_95px_125px] max-[600px]:gap-3">
            <div className="relative row-span-2 overflow-hidden rounded-[18px] group">
              <Image
                src="https://images.pexels.com/photos/7546771/pexels-photo-7546771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Botanical wallpaper in an elegant hallway"
                fill
                sizes="30vw"
                className="transition-transform duration-[0.6s] group-hover:scale-[1.04]"
              />
            </div>

            <div className="relative col-start-2 row-start-1 overflow-hidden rounded-[18px] group">
              <Image
                src={images.painter}
                alt="Craftsperson preparing a wall for finishing"
                fill
                sizes="30vw"
                className="transition-transform duration-[0.6s] group-hover:scale-[1.04]"
              />
            </div>

            <div className="relative col-start-2 row-span-2 row-start-2 overflow-hidden rounded-[18px] group">
              <Image
                src="https://images.pexels.com/photos/6764289/pexels-photo-6764289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Paint roller applying a blue wall finish"
                fill
                sizes="30vw"
                className="transition-transform duration-[0.6s] group-hover:scale-[1.04]"
              />
            </div>

            <Reveal dir="up" delay={0.3}>
              <div className="absolute bottom-[22px] left-[-4px] z-[2] flex items-center gap-3 rounded-[14px] bg-[#e9eafa] px-[18px] py-4 shadow-[0_12px_30px_rgba(0,51,78,0.1)] max-[600px]:bottom-[14px] max-[600px]:left-0 max-[600px]:p-3">
                <div className="flex">
                  <span className="grid h-[27px] w-[27px] place-items-center rounded-full border-2 border-[#e9eafa] bg-white text-[10px] font-bold text-blue">
                    ES
                  </span>
                  <span className="-ml-[7px] grid h-[27px] w-[27px] place-items-center rounded-full border-2 border-[#e9eafa] bg-white text-[10px] font-bold text-blue">
                    J
                  </span>
                  <span className="-ml-[7px] grid h-[27px] w-[27px] place-items-center rounded-full border-2 border-[#e9eafa] bg-white text-[10px] font-bold text-blue">
                    M
                  </span>
                  <span className="-ml-[7px] grid h-[27px] w-[27px] place-items-center rounded-full border-2 border-[#e9eafa] bg-white text-[10px] font-bold text-blue">
                    +
                  </span>
                </div>

                <div>
                  <b className="block text-[18px] text-navy">500+</b>
                  <small className="text-[11px] text-ink">
                    Spaces transformed
                  </small>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>

        <div
          
        >
          <SectionHeader
            eyebrow="ABOUT US"
            title="We don’t just paint walls. We transform spaces."
            text="At Enviroshield, we believe walls are more than surfaces. They are opportunities to express personality, comfort, and style. Our team combines professional craftsmanship with thoughtful design to create spaces that feel truly yours."
          />

          <StaggerContainer className="mb-[30px] grid grid-cols-2 gap-x-[22px] gap-y-[15px] max-[600px]:grid-cols-1 max-[600px]:gap-3">
            {[
              "Your vision, our expertise",
              "Walls are our canvas",
              "Premium materials & finishes",
              "Your space is our inspiration",
              "Built on trust",
              "Passionate about quality",
            ].map((item) => (
              <StaggerItem
                key={item}
                className="flex items-center gap-2 text-[13px] font-bold text-navy"
              >
                <CheckCircle2
                  size={16}
                  className="flex-none text-blue"
                  aria-hidden="true"
                />
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
