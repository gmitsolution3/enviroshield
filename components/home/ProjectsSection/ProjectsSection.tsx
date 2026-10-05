import { getFeaturedProjects } from "@/lib/api/projects";
import ProjectsSectionContent from "./ProjectsSectionContent";
import {IProject} from "@/types";

export default async function ProjectsSection() {
  let projects: IProject[] = [];

  try {
    projects = await getFeaturedProjects();
  } catch {
    projects = [];
  }

  return <ProjectsSectionContent projects={projects} />;
}