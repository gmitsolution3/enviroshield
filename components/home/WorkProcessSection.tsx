import { images, processSteps } from "@/lib/data/content";
import Image from "next/image";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function WorkProcessSection() {
  return (
    <section className="section process-section">
      <div className="container process-grid">
        <Reveal dir="up">
          <SectionHeader
            eyebrow="OUR WORK PROCESS"
            title="A smooth, stress-free process from start to finish"
            text="Good work starts with good communication. We keep you informed, your space respected, and every detail accounted for."
          />
          <StaggerContainer className="process-list">
            {processSteps.map((step) => (
              <StaggerItem key={step.number} className="process-item">
                <span className="process-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>
        <Reveal dir="image" delay={0.2}>
          <div className="process-visual">
            <div className="process-photo-main">
              <Image
                src={images.painter}
                alt="Painter carefully preparing an interior wall"
                fill
                sizes="45vw"
              />
            </div>
            <div className="process-photo-small">
              <Image
                src="https://images.pexels.com/photos/16751235/pexels-photo-16751235.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Paint roller on a textured wall"
                fill
                sizes="25vw"
              />
            </div>
            <div className="process-badge">
              <strong>01</strong>Every detail matters.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
