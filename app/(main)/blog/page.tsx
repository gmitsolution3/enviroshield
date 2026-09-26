import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { blogPosts } from "@/lib/data/content";

export const metadata = {
  title: "Journal | Enviroshield ideas and inspiration",
  description:
    "Ideas, guides, and inspiration for better walls and better spaces from the Enviroshield team.",
};

export default function BlogPage() {
  const categories = [
    "All",
    ...Array.from(new Set(blogPosts.map((p) => p.category))),
  ];

  return (
    <>
      <PageHero
        eyebrow="JOURNAL"
        title="Ideas, guides and inspiration for better spaces."
        text="Practical advice and thoughtful ideas from our team — from choosing a colour to preparing a wall properly."
        image="https://images.pexels.com/photos/7546558/pexels-photo-7546558.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
      />

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container>
          <SectionHeader
            eyebrow="ALL ARTICLES"
            title="Latest from the journal"
          />

          <div className="mt-11 grid grid-cols-[210px_1fr] gap-[55px] max-[900px]:grid-cols-1">
            <Reveal dir="left">
              <aside>
                <p className="mb-[18px] text-[12px] font-extrabold uppercase tracking-[0.13em] text-navy">
                  Categories
                </p>

                <div
                  className="grid gap-[5px] max-[900px]:flex max-[900px]:flex-wrap"
                  id="blog-filter"
                >
                  {categories.map((category) => (
                    <button
                      key={category}
                      data-category={category}
                      className={`rounded-[7px] px-3 py-[10px] text-left text-[13px] text-ink transition-colors ${
                        category === "All"
                          ? "bg-[#e9f3fd] font-bold text-blue"
                          : "hover:bg-[#e9f3fd] hover:font-bold hover:text-blue"
                      } max-[900px]:border max-[900px]:border-line`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </aside>
            </Reveal>

            <StaggerContainer
              className="grid grid-cols-3 gap-[25px] max-[600px]:grid-cols-1 max-[600px]:gap-10"
              id="blog-grid"
            >
              {blogPosts.map((post) => (
                <StaggerItem
                  key={post.slug}
                  data-category={post.category}
                >
                  <div className="transition-shadow duration-300">
                    <div className="relative mb-5 h-[235px] overflow-hidden rounded-[14px] max-[900px]:h-[240px]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="block h-full w-full object-cover"
                      />
                    </div>

                    <div className="mb-[10px] flex items-center gap-[14px] text-[11px] text-ink">
                      <span>{post.category}</span>
                      <span className="border-l border-line pl-[14px]">
                        {post.date}
                      </span>
                    </div>

                    <h3 className="mb-[10px] text-[21px] font-extrabold leading-[1.2] tracking-[-0.03em] text-navy">
                      {post.title}
                    </h3>

                    <p className="mb-4 text-[14px] leading-[1.6] text-ink">
                      {post.excerpt}
                    </p>

                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-[7px] text-[13px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                    >
                      Read article
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>
    </>
  );
}
