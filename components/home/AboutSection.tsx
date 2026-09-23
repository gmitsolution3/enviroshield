import { images } from "@/lib/data/content";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { AnimatedCounter } from "../animations/animated-counter";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function AboutSection() {
  return (
    <section className="section">
      <div className="container about-grid">
        <Reveal dir="image">
          <div className="about-collage">
            <div className="collage-image collage-one">
              <Image
                src="https://images.pexels.com/photos/7546771/pexels-photo-7546771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Botanical wallpaper in an elegant hallway"
                fill
                sizes="30vw"
              />
            </div>
            <div className="collage-image collage-two">
              <Image
                src={images.painter}
                alt="Craftsperson preparing a wall"
                fill
                sizes="30vw"
              />
            </div>
            <div className="collage-image collage-three">
              <Image
                src="https://images.pexels.com/photos/6764289/pexels-photo-6764289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Paint roller applying a blue finish"
                fill
                sizes="30vw"
              />
            </div>
            <Reveal dir="up" delay={0.3}>
              <div className="happy-card">
                <div className="mini-avatars">
                  <span>ES</span>
                  <span>J</span>
                  <span>M</span>
                  <span>+</span>
                </div>
                <div>
                  <b>500+</b>
                  <small>Spaces transformed</small>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>
        <div className="about-copy">
          <SectionHeader
            eyebrow="ABOUT US"
            title="We don’t just paint walls. We transform spaces."
            text="At Enviroshield, we believe walls are more than surfaces. They are opportunities to express personality, comfort, and style. Our team combines professional craftsmanship with thoughtful design to create spaces that feel truly yours."
          />
          <StaggerContainer className="benefits">
            {[
              "Your vision, our expertise",
              "Walls are our canvas",
              "Premium materials & finishes",
              "Your space is our inspiration",
              "Built on trust",
              "Passionate about quality",
            ].map((item) => (
              <StaggerItem key={item} className="benefit">
                <CheckCircle2 size={16} />
                {item}
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="stats">
            <div className="stat">
              <strong>
                <AnimatedCounter value={99} suffix="%" />
              </strong>
              <span>Customer satisfaction</span>
            </div>
            <div className="stat">
              <strong>
                <AnimatedCounter value={500} suffix="+" />
              </strong>
              <span>Projects completed</span>
            </div>
          </div>
          <Button href="/about" variant="outline">
            More about us
          </Button>
        </div>
      </div>
    </section>
  );
}