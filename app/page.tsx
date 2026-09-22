import { AnimatedCounter } from "@/components/animations/animated-counter";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Hero from "@/components/home/hero";
import ServicesSection from "@/components/home/services-section";
import {
  BlogCard,
  Button,
  ContactSection,
  Footer,
  Header,
  ProjectCard,
  Reveal,
  SectionHeader,
  TestimonialCarousel,
} from "@/components/shared";
import {
  blogPosts,
  images,
  processSteps,
  projects,
} from "@/lib/data/content";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* About */}
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
            <Reveal dir="up" delay={0.15}>
              <div className="about-copy">
                <div className="eyebrow">
                  <span />
                  ABOUT US
                </div>
                <h2>
                  We don&rsquo;t just paint walls. We transform
                  spaces.
                </h2>
                <p>
                  At Enviroshield, we believe walls are more than
                  surfaces. They are opportunities to express
                  personality, comfort, and style. Our team combines
                  professional craftsmanship with thoughtful design to
                  create spaces that feel truly yours.
                </p>
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
            </Reveal>
          </div>
        </section>

        {/* Services */}
        <ServicesSection />

        {/* Work Process */}
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
                  <StaggerItem
                    key={step.number}
                    className="process-item"
                  >
                    <span className="process-number">
                      {step.number}
                    </span>
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

        {/* Projects */}

        <section className="section projects-section">
          <div className="container">
            <div className="projects-head">
              <SectionHeader
                eyebrow="OUR WORK"
                title="See our work in action"
                text="A few spaces we have had the pleasure of helping take shape."
                light
              />
              <Button href="/services" variant="light">
                View all projects
              </Button>
            </div>
            <div className="project-grid">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section testimonial-section">
          <div className="container testimonial-layout">
            <SectionHeader
              eyebrow="TESTIMONIALS"
              title="What our clients are saying"
              text="Real experiences from homeowners and businesses we have helped transform."
            />
            <Reveal dir="up" delay={0.1}>
              <TestimonialCarousel />
            </Reveal>
          </div>
        </section>

        {/* Blog */}
        <section className="section blog-section">
          <div className="container">
            <div className="blog-head">
              <SectionHeader
                eyebrow="OUR JOURNAL"
                title="Insights, ideas & inspiration"
              />
              <Reveal dir="up" delay={0.1}>
                <Button href="/blog" variant="outline">
                  View all articles
                </Button>
              </Reveal>
            </div>
            <StaggerContainer className="blog-grid">
              {blogPosts.map((post, i) => (
                <StaggerItem key={post.slug}>
                  <BlogCard post={post} index={0} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
