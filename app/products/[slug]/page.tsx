import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button, Footer, Header, PageHero, Reveal, SectionHeader } from '@/components/shared';
import { products } from '@/lib/data/content';

export const metadata = { title: 'Product details | Enviroshield', description: 'Learn more about this Enviroshield product.' };

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();
  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow={product.category} title={product.name} text={product.description} image={product.image} />
        <section className="section">
          <div className="container detail-grid">
            <Reveal dir="image">
              <div className="detail-photo"><Image src={product.image} alt={product.name} fill sizes="45vw" /></div>
            </Reveal>
            <Reveal dir="up" delay={0.15}>
              <div className="detail-copy">
                <SectionHeader eyebrow="PRODUCT DETAILS" title={product.name} text={product.description} />
                <div className="product-features" style={{ marginBottom: 26 }}>{product.features.map((f) => <span key={f}>{f}</span>)}</div>
                <Button href="/contact">Ask about this product</Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
