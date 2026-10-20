import { Button } from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { getPublishedProductBySlug } from "@/lib/api/products";
import { products as staticProducts } from "@/lib/data/content";
import Image from "next/image";
import { notFound } from "next/navigation";

async function findProduct(slug: string) {
  try {
    return await getPublishedProductBySlug(slug);
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found.") return null;
    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (product) {
    return {
      title: product.seo?.metaTitle || `${product.name} | Enviroshield`,
      description: product.seo?.metaDescription || product.shortDescription,
      robots: product.seo?.noIndex ? { index: false, follow: false } : undefined,
      keywords: product.seo?.keywords,
      openGraph: {
        title: product.seo?.ogTitle || product.name,
        description: product.seo?.ogDescription || product.shortDescription,
        images: [product.seo?.ogImage || product.primaryImage.url],
      },
    };
  }
  const staticProduct = staticProducts.find((item) => item.slug === slug);
  return staticProduct
    ? { title: `${staticProduct.name} | Enviroshield`, description: staticProduct.description }
    : { title: "Product not found | Enviroshield", description: "The requested Enviroshield product could not be found." };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await findProduct(slug);
  const staticProduct = product ? null : staticProducts.find((item) => item.slug === slug);
  if (!product && !staticProduct) notFound();

  const name = product?.name ?? staticProduct!.name;
  const category = product?.categoryId.name ?? staticProduct!.category;
  const image = product?.primaryImage.url ?? staticProduct!.image;
  const description = product?.shortDescription ?? staticProduct!.description;

  return (
    <>
      <PageHero eyebrow={category} title={name} text={description} image={image} imageAlt={`${name} - ${category}`} />
      <section aria-labelledby="product-details-heading" className="py-[112px] max-[900px]:py-20 max-[600px]:py-16">
        <Container className="grid grid-cols-2 items-center gap-[70px] max-[900px]:grid-cols-1 max-[900px]:gap-[50px]">
          <Reveal dir="image">
            <div className="relative h-[530px] overflow-hidden rounded-[18px] max-[600px]:h-[340px]">
              <Image src={image} alt={product?.primaryImage.alt ?? `${name} - ${category}`} fill sizes="45vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal dir="up" delay={0.15}>
            <div>
              <SectionHeader eyebrow="PRODUCT DETAILS" title={`About ${name}`} text={description} headingId="product-details-heading" />
              {product ? (
                <dl className="mb-[26px] grid gap-3 rounded-[12px] border border-line bg-white p-5 text-[13px] sm:grid-cols-2">
                  <div><dt className="font-bold text-navy">SKU</dt><dd className="mt-1 text-ink">{product.sku}</dd></div>
                  <div><dt className="font-bold text-navy">Price</dt><dd className="mt-1 text-ink">৳{product.price.toLocaleString("en-BD")}</dd></div>
                  {product.weight > 0 && <div><dt className="font-bold text-navy">Pack weight</dt><dd className="mt-1 text-ink">{product.weight} kg</dd></div>}
                </dl>
              ) : (
                <div className="mb-[26px] flex flex-wrap gap-2">
                  {staticProduct!.features.map((feature) => <span key={feature} className="rounded-full border border-line px-3 py-[7px] text-[12px] text-ink">{feature}</span>)}
                </div>
              )}
              <Button href="/contact">Ask about this product</Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
