import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import Container from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { products } from "@/lib/data/content";

export const metadata = {
  title: "Products | Enviroshield paints, primers and finishes",
  description:
    "Explore the Enviroshield range: interior and exterior paints, primers, protective coatings, decorative finishes and wallcoverings.",
};

export default function ProductsPage() {
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <>
      <PageHero
        eyebrow="PRODUCTS"
        title="Finishes and materials you can trust."
        text="A curated range of paints, primers, coatings and wallcoverings — chosen for performance, feel, and longevity."
        image="https://images.pexels.com/photos/9222200/pexels-photo-9222200.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
      />

      <section className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container>
          <SectionHeader
            eyebrow="CATALOGUE"
            title="Browse the range"
            text="An informational catalogue of the products we use and recommend."
          />

          <div className="mt-11 grid grid-cols-[210px_1fr] gap-[55px] max-[900px]:grid-cols-1">
            <Reveal dir="left">
              <aside data-filter>
                <p className="mb-[18px] text-[12px] font-extrabold uppercase tracking-[0.13em] text-navy">
                  Categories
                </p>

                <div
                  className="grid gap-[5px] max-[900px]:flex max-[900px]:flex-wrap"
                  id="product-filter"
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
              className="grid grid-cols-2 gap-[25px] max-[600px]:grid-cols-1"
              id="product-grid"
            >
              {products.map((product) => (
                <StaggerItem
                  key={product.slug}
                  data-category={product.category}
                >
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>
    </>
  );
}
