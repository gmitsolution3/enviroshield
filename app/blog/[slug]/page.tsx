import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import Header from "@/components/Header/Header";
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
      <Header />
      <main>
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="article">
              <Reveal dir="up">
                <div className="article-meta">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                  <span>{post.author}</span>
                </div>
                <h1>{post.title}</h1>
              </Reveal>
              <Reveal dir="image" delay={0.1}>
                <div className="article-hero">
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
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal dir="up" className="article article-content">
              <p>{post.excerpt}</p>
              <h2>The detail is the difference</h2>
              <p>
                The best finishes begin long before the first coat of
                colour. Preparation — sanding, filling, cleaning,
                priming — is where a good result becomes a great one.
                It is also the step most likely to be rushed. We take
                the time to do it properly, because every layer that
                follows depends on it.
              </p>
              <h2>Choosing what feels right</h2>
              <p>
                Colour, sheen, texture and light all interact in ways
                that are hard to predict from a small sample. We help
                you think through how a finish will look across the
                day, against your furniture, and alongside the natural
                light in your space.
              </p>
              <p>
                If you are considering a similar project, we would be
                glad to talk it through with you.
              </p>
              <Button href="/contact">Talk to an expert</Button>
            </Reveal>
          </div>
        </section>
        <section className="section process-section">
          <div className="container">
            <SectionHeader
              eyebrow="KEEP READING"
              title="Related articles"
            />
            <StaggerContainer
              className="blog-grid"
              style={{ marginTop: 44 }}
            >
              {related.map((p) => (
                <StaggerItem key={p.slug} className="blog-card">
                  <div className="blog-image">
                    <img src={p.image} alt={p.title} />
                  </div>
                  <div className="blog-meta">
                    <span>{p.category}</span>
                    <span>{p.date}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <Link
                    className="text-link"
                    href={`/blog/${p.slug}`}
                  >
                    Read article <ArrowUpRight size={16} />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
