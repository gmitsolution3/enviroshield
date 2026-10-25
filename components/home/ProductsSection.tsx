import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import Container from "../Container";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";
import { getPublishedProducts } from "@/lib/api/products";

export default async function ProductsSection() {
  let products = [];

  try {
    const result = await getPublishedProducts({
      page: 1,
      limit: 6,
    });

    products = result.data;
  } catch (error) {
    console.error("Failed to load homepage products:", error);
  }

  return (
    <section
      aria-labelledby="products-heading"
      className="py-[112px]"
    >
      <Container>
        <div className="flex items-end justify-between gap-[25px] max-[900px]:flex-col max-[900px]:items-start">
          <SectionHeader
            eyebrow="OUR PRODUCTS"
            title="Finishes and materials you can trust."
            headingId="products-heading"
          />

          <Reveal dir="up" delay={0.1}>
            <Button href="/products" variant="outline">
              View all products
            </Button>
          </Reveal>
        </div>

        {products.length > 0 ? (
          <StaggerContainer className="mt-12 grid grid-cols-3 gap-[25px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            {products.map((product) => (
              <StaggerItem
                key={product._id}
                data-category={product.categoryId?.name}
              >
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <p className="mt-12 text-center text-sm text-ink/60">
            Products are temporarily unavailable. Please visit our products
            page to explore our range.
          </p>
        )}
      </Container>
    </section>
  );
}