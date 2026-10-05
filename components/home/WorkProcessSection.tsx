import { images } from "@/lib/data/content";
import { Calculator, Eraser, PencilRuler, Tv } from "lucide-react";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

// Swap these with the exact assets from your design.
const DECOR_SRC = "/images/work-paint.webp"; // paint brushes + blue splash, top-left
const BIG_IMAGE = {
  src: images.painter,
  alt: "Painter carefully preparing an interior wall",
};
const SMALL_IMAGE = {
  src: "https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  alt: "Man painting a patterned blue wall",
};

const steps = [
  {
    number: "01",
    title: "Consultation & Vision Planning",
    description:
      "We begin by understanding your goal preference & space. Whether you have a clear design mind.",
    icon: Tv,
  },
  {
    number: "02",
    title: "Detailed Quote & Timeline",
    description:
      "No surprises—just clarity. Receive a transparent estimate, timeline, and project plan tailored.",
    icon: Calculator,
  },
  {
    number: "03",
    title: "Final Walkthrough & Cleanup",
    description:
      "We finish with a thorough inspection & spotless cleanup. Your satisfaction is our priority leave.",
    icon: Eraser,
  },
  {
    number: "04",
    title: "Surface Preparation",
    description:
      "We prep walls to perfection cleaning, repairing, & smoothing every surface for a flawless finish.",
    icon: PencilRuler,
  },
];

export default function WorkProcessSection() {
  return (
    <section
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-16"
    >
      {/* decorative paint brushes, top-left */}
      <Image
        src={DECOR_SRC}
        alt=""
        aria-hidden="true"
        width={240}
        height={240}
        className="pointer-events-none absolute top-0 left-0 w-[240px] max-[900px]:w-[150px] max-[600px]:w-[110px]"
      />

      <Container className="relative grid grid-cols-[1.1fr_0.9fr] items-center gap-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        <Reveal dir="up">
          <SectionHeader
            eyebrow="OUR WORK PROCESS"
            title="A smooth, stress-free process from start to finish"
            text="Good work starts with good communication. We keep you informed, your space respected, and every detail accounted for."
            headingId="process-heading"
          />

          <StaggerContainer className="mt-10 flex flex-col gap-[18px]">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.number}>
                  {/* hover lives on this inner div so it doesn't fight the stagger animation */}
                  <div className="group flex cursor-pointer items-start gap-7 rounded-[6px] bg-white p-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,51,78,0.12)] max-[600px]:gap-4 max-[600px]:p-4">
                    <div className="relative grid h-[90px] w-[90px] flex-none place-items-center rounded-full bg-mist transition-colors duration-300 group-hover:bg-blue max-[600px]:h-[68px] max-[600px]:w-[68px]">
                      <Icon
                        size={40}
                        strokeWidth={1.5}
                        className="text-navy transition-colors duration-300 group-hover:text-white max-[600px]:size-8"
                        aria-hidden="true"
                      />
                      <span
                        className="absolute top-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-blue text-[12px] font-bold text-white ring-0 transition-all duration-300 group-hover:bg-navy max-[600px]:h-6 max-[600px]:w-6 max-[600px]:text-[11px]"
                        aria-hidden="true"
                      >
                        {step.number}
                      </span>
                    </div>

                    <div className="pt-px">
                      <h3 className="mb-3 text-[22px] font-medium leading-[26px] text-navy transition-colors duration-300 group-hover:text-blue max-[600px]:text-[18px]">
                        {step.title}
                      </h3>
                      <p className="m-0 text-[15px] leading-[23px] text-[#666]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Reveal>

        <Reveal dir="image" delay={0.2}>
          <div className="relative h-[585px] max-[900px]:mx-auto max-[900px]:h-[470px] max-[900px]:w-full max-[900px]:max-w-[600px] max-[600px]:h-[380px]">
            <div className="absolute top-0 right-0 h-[64.6%] w-[75%] overflow-hidden rounded-[18px]">
              <Image
                src={BIG_IMAGE.src}
                alt={BIG_IMAGE.alt}
                fill
                sizes="(max-width: 900px) 70vw, 32vw"
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-0 left-0 box-border h-[53.8%] w-[65.4%] overflow-hidden rounded-[18px] border-[8px] border-white bg-white">
              <Image
                src={SMALL_IMAGE.src}
                alt={SMALL_IMAGE.alt}
                fill
                sizes="(max-width: 900px) 60vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}