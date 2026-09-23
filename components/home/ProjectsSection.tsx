import { projects } from "@/lib/data/content";
import { Button } from "../Button";
import { ProjectCard } from "../ProjectCard";
import { SectionHeader } from "../SectionHeader";

export default function ProjectsSection() {
  return (
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
  );
}
