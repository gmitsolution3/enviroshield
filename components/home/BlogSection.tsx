import { getPublishedBlogs } from "@/lib/api/blogs";
import { IBlog } from "@/types";
import { StaggerContainer, StaggerItem } from "../animations/reveal";
import BlogCard from "../blog/BlogCard";
import { Button } from "../Button";
import Container from "../Container";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default async function BlogSection() {
  let blogs: IBlog[] = [];

  try {
    const result = await getPublishedBlogs({
      page: 1,
      limit: 6,
    });

    blogs = result.data;
  } catch {
    blogs = [];
  }

  return (
    <section
      aria-labelledby="blog-heading"
      className="py-[112px] pb-[120px] max-[900px]:py-20 max-[900px]:pb-[120px] max-[600px]:py-16 max-[600px]:pb-[120px] shadow"
    >
      <Container>
        <div className="mb-12 flex items-end justify-between max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-[25px]">
          <SectionHeader
            eyebrow="ENVIRO SHIELD INSIGHTS"
            title="Expert insights for better protection"
            text="Discover practical advice, industry insights, and expert guidance on waterproofing, flooring, heat insulation, and protecting your property for the long term."
            headingId="blog-heading"
          />

          <Reveal dir="up" delay={0.1}>
            <Button href="/blog" variant="outline">
              Explore all insights
            </Button>
          </Reveal>
        </div>

        {blogs.length > 0 ? (
          <StaggerContainer className="grid grid-cols-3 gap-[25px] max-[600px]:grid-cols-1 max-[600px]:gap-10">
            {blogs.map((post, index) => (
              <StaggerItem key={post._id}>
                <BlogCard post={post} index={index} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="rounded-[18px] border border-line bg-mist px-6 py-12 text-center">
            <h3 className="text-[24px] font-extrabold tracking-[-0.03em] text-navy">
              Our insights are coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-[1.7] text-ink">
              We&apos;re preparing practical insights and expert
              guidance on waterproofing, flooring, insulation, and
              long-term building protection. Please check back soon.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
