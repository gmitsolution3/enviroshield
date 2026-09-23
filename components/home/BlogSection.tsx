import { blogPosts } from "@/lib/data/content";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { BlogCard } from "../BlogCard";
import { Button } from "../Button";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function BlogSection() {
  return (
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
  );
}
