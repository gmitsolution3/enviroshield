import { images, processSteps } from "@/lib/data/content";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function WorkProcessSection() {
  return (
    <section className="bg-mist py-[112px] max-[900px]:py-20 max-[600px]:py-16">
      <Container className="grid grid-cols-[1.1fr_0.9fr] items-center gap-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
        <Reveal dir="up">
          <SectionHeader
            eyebrow="OUR WORK PROCESS"
            title="A smooth, stress-free process from start to finish"
            text="Good work starts with good communication. We keep you informed, your space respected, and every detail accounted for."
          />

          <StaggerContainer className="mt-10">
            {processSteps.map((step) => (
              <StaggerItem
                key={step.number}
                className="grid grid-cols-[46px_1fr] gap-[18px] border-b border-[#d9dde8] py-[22px]"
              >
                <span className="pt-1 text-[12px] font-extrabold text-blue">
                  {step.number}
                </span>

                <div>
                  <h3 className="mb-[7px] text-[18px] text-navy">
                    {step.title}
                  </h3>

                  <p className="m-0 text-[14px] leading-[1.6] text-ink">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>

        <Reveal dir="image" delay={0.2}>
          <div className="relative h-[560px] max-[900px]:mx-auto max-[900px]:h-[460px] max-[900px]:w-full max-[900px]:max-w-[600px] max-[600px]:h-[360px]">
            <div className="absolute inset-0 right-[80px] bottom-[80px] overflow-hidden rounded-[18px] max-[600px]:right-[35px] max-[600px]:bottom-[45px]">
              <Image
                src={images.painter}
                alt="Painter carefully preparing an interior wall"
                fill
                sizes="45vw"
              />
            </div>

            <div className="absolute right-0 bottom-0 h-[47%] w-[52%] overflow-hidden rounded-[18px] border-[12px] border-mist max-[600px]:border-[7px]">
              <Image
                src="https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Paint roller on a textured wall"
                fill
                sizes="25vw"
              />
            </div>

            <div className="absolute top-[42%] left-[-28px] w-[130px] rounded-[13px] bg-blue p-[18px] text-[11px] leading-[1.5] text-white shadow-[0_14px_28px_rgba(1,110,220,0.2)] max-[600px]:top-[38%] max-[600px]:left-[-5px] max-[600px]:w-[105px] max-[600px]:p-3">
              <strong className="block text-[25px] max-[600px]:text-[21px]">
                01
              </strong>
              Every detail matters.
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
