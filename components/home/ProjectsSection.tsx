import { projects } from "@/lib/data/content";
import { Button } from "../Button";
import Container from "../Container";
import { ProjectCard } from "../ProjectCard";
import { SectionHeader } from "../SectionHeader";

export default function ProjectsSection() {
  return (
    <section
      aria-labelledby="projects-heading"
      className="bg-deep py-[112px] pb-[120px] max-[900px]:py-20 max-[900px]:pb-[120px] max-[600px]:py-16 max-[600px]:pb-[120px]"
    >
      <Container>
        <div className="mb-11 flex items-end justify-between max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[25px]">
          <SectionHeader
            eyebrow="OUR WORK"
            title="See our work in action"
            text="A few spaces we have had the pleasure of helping take shape."
            light
            headingId="projects-heading"
          />

          <Button href="/services" variant="light">
            View all projects
          </Button>
        </div>

        <div className="grid grid-cols-[1.15fr_0.85fr_1fr] grid-rows-[260px_260px] gap-[18px] max-[900px]:grid-cols-2 max-[900px]:grid-rows-[260px_220px_220px] max-[600px]:flex max-[600px]:flex-col">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
