import { products } from "@/lib/data/content";

import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import Container from "../Container";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function ProductsSection() {
  return (
    <section className="py-[112px]">
      <Container>
        <div className="flex items-end justify-between gap-[25px] max-[900px]:flex-col max-[900px]:items-start">
          <SectionHeader
            eyebrow="OUR PRODUCTS"
            title="Finishes and materials you can trust."
          />

          <Reveal dir="up" delay={0.1}>
            <Button href="/products" variant="outline">
              View all products
            </Button>
          </Reveal>
        </div>

        <StaggerContainer className="mt-12 grid grid-cols-2 gap-[25px] max-[600px]:grid-cols-1">
          {products.map((product) => (
            <StaggerItem
              key={product.slug}
              data-category={product.category}
            >
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
