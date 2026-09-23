import { products } from "@/lib/data/content";

import { StaggerContainer, StaggerItem } from "../animations/reveal";
import { Button } from "../Button";
import { Reveal } from "../Reveal";
import { SectionHeader } from "../SectionHeader";

export default function ProductsSection() {
  return (
    <section className="section products-section">
      <div className="container">
        <div className="products-head flex items-center justify-between">
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

        <StaggerContainer className="product-grid">
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
    </section>
  );
}
