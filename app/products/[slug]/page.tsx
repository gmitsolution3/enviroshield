import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/components/Button";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { products } from "@/lib/data/content";

export const metadata = {
  title: "Product details | Enviroshield",
  description: "Learn more about this Enviroshield product.",
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) notFound();

  return (
    <>
      <Header />

      <main>
        <PageHero
          eyebrow={product.category}
          title={product.name}
          text={product.description}
          image={product.image}
        />

        <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
          <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
            <Reveal dir="image">
              <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="45vw"
                />
              </div>
            </Reveal>

            <Reveal dir="up" delay={0.15}>
              <div>
                <SectionHeader
                  eyebrow="PRODUCT DETAILS"
                  title={product.name}
                  text={product.description}
                />

                <div className="mb-[26px] flex flex-wrap gap-2">
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-line px-3 py-[7px] text-[12px] text-ink"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button href="/contact">
                  Ask about this product
                </Button>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
