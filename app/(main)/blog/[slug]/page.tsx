import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { blogPosts } from "@/lib/data/content";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Article | Enviroshield",
  description: "An article from the Enviroshield journal.",
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <section className="pt-[112px] max-[900px]:pt-20 max-[600px]:pt-16">
        <Container>
          <div className="mx-auto max-w-[850px]">
            <Reveal dir="up">
              <div className="mb-6 flex gap-[15px] text-[12px] text-ink">
                <span>{post.category}</span>
                <span>{post.date}</span>
                <span>{post.author}</span>
              </div>

              <h1 className="mb-[30px] text-[clamp(40px,6vw,68px)] font-extrabold leading-[1.02] tracking-[-0.05em] text-navy max-[600px]:text-[42px]">
                {post.title}
              </h1>
            </Reveal>

            <Reveal dir="image" delay={0.1}>
              <div className="relative mb-10 h-[480px] overflow-hidden rounded-[18px] max-[600px]:h-[300px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="100vw"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-[112px] max-[900px]:pb-20 max-[600px]:pb-16">
        <Container>
          <Reveal
            dir="up"
            className="mx-auto max-w-[850px] text-[17px] leading-[1.8] text-ink"
          >
            <p className="mb-5">{post.excerpt}</p>

            <h2 className="my-[36px] mb-[15px] text-[30px] leading-[1.1] text-navy">
              The detail is the difference
            </h2>

            <p className="mb-5">
              The best finishes begin long before the first coat of
              colour. Preparation — sanding, filling, cleaning,
              priming — is where a good result becomes a great one. It
              is also the step most likely to be rushed. We take the
              time to do it properly, because every layer that follows
              depends on it.
            </p>

            <h2 className="my-[36px] mb-[15px] text-[30px] leading-[1.1] text-navy">
              Choosing what feels right
            </h2>

            <p className="mb-5">
              Colour, sheen, texture and light all interact in ways
              that are hard to predict from a small sample. We help
              you think through how a finish will look across the day,
              against your furniture, and alongside the natural light
              in your space.
            </p>

            <p className="mb-5">
              If you are considering a similar project, we would be
              glad to talk it through with you.
            </p>

            <Button href="/contact">Talk to an expert</Button>
          </Reveal>
        </Container>
      </section>

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container>
          <SectionHeader
            eyebrow="KEEP READING"
            title="Related articles"
          />

          <StaggerContainer className="mt-11 grid grid-cols-3 gap-[25px] max-[600px]:grid-cols-1 max-[600px]:gap-10">
            {related.map((relatedPost) => (
              <StaggerItem key={relatedPost.slug}>
                <div>
                  <div className="relative mb-5 h-[235px] overflow-hidden rounded-[14px] max-[900px]:h-[240px]">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="block h-full w-full object-cover"
                    />
                  </div>

                  <div className="mb-[10px] flex items-center gap-[14px] text-[11px] text-ink">
                    <span>{relatedPost.category}</span>
                    <span className="border-l border-line pl-[14px]">
                      {relatedPost.date}
                    </span>
                  </div>

                  <h3 className="mb-[10px] text-[21px] font-extrabold leading-[1.2] tracking-[-0.03em] text-navy">
                    {relatedPost.title}
                  </h3>

                  <p className="mb-4 text-[14px] leading-[1.6] text-ink">
                    {relatedPost.excerpt}
                  </p>

                  <Link
                    className="inline-flex items-center gap-[7px] text-[13px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
                    href={`/blog/${relatedPost.slug}`}
                  >
                    Read article
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </>
  );
}
