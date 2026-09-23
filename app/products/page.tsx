import {
  Reveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
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
      <Header />
      <main>
        <PageHero
          eyebrow="PRODUCTS"
          title="Finishes and materials you can trust."
          text="A curated range of paints, primers, coatings and wallcoverings — chosen for performance, feel, and longevity."
          image="https://images.pexels.com/photos/9222200/pexels-photo-9222200.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1600"
        />
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="CATALOGUE"
              title="Browse the range"
              text="An informational catalogue of the products we use and recommend."
            />
            <div className="catalog-layout" style={{ marginTop: 44 }}>
              <Reveal dir="left">
                <aside data-filter>
                  <p className="filter-title">Categories</p>
                  <div className="filter-list" id="product-filter">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        data-category={cat}
                        className={cat === "All" ? "active" : ""}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </aside>
              </Reveal>
              <StaggerContainer
                className="product-grid"
                id="product-grid"
              >
                {products.map((product) => (
                  <StaggerItem
                    key={product.slug}
                    data-category={product.category}
                    className="product-card"
                  >
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-body">
                      <span className="card-kicker">
                        {product.category}
                      </span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="product-features">
                        {product.features.map((f) => (
                          <span key={f}>{f}</span>
                        ))}
                      </div>
                      <a
                        className="text-link"
                        href={`/products/${product.slug}`}
                      >
                        View details
                      </a>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
