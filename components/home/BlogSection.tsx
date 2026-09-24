import { blogPosts } from "@/lib/data/content";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { BlogCard } from "../BlogCard";
import { Button } from "../Button";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function BlogSection() {
  return (
    <section className="py-[112px] pb-[120px] max-[900px]:py-20 max-[900px]:pb-[120px] max-[600px]:py-16 max-[600px]:pb-[120px]">
      <Container>
        <div className="mb-12 flex items-end justify-between max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[25px]">
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

        <StaggerContainer className="grid grid-cols-3 gap-[25px] max-[600px]:grid-cols-1 max-[600px]:gap-10">
          {blogPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <BlogCard post={post} index={0} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
