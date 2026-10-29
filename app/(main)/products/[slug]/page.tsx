import BlogContent from "@/components/blog/BlogContent";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import AddToCart from "@/components/products/AddToCart";
import ProductGallery from "@/components/products/ProductGallery";
import { Reveal } from "@/components/Reveal";
import {
  getPublishedProductBySlug,
  getPublishedProducts,
} from "@/lib/api/products";
import { getProductImageUrl } from "@/lib/products/images";
import { getTrustedTdsUrl } from "@/lib/products/tds";
import { siteUrl } from "@/lib/site-url";
import type {
  IProductImage,
  IPublishedProduct,
} from "@/types/admin/product.type";
import type { JSONContent } from "@tiptap/react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  FileText,
  Layers,
  Scale,
  Tag,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProductDescription(product: IPublishedProduct) {
  const metaDescription =
    typeof product.seo?.metaDescription === "string"
      ? product.seo.metaDescription.trim()
      : "";

  const shortDescription =
    typeof product.shortDescription === "string"
      ? product.shortDescription.trim()
      : "";

  return (
    metaDescription ||
    shortDescription ||
    `Explore ${product.name} from Enviroshield.`
  );
}

function formatPrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(price);
}

function hasRichContent(content: unknown): content is JSONContent {
  if (!content || typeof content !== "object") {
    return false;
  }

  const value = content as {
    type?: unknown;
    content?: unknown;
  };

  return (
    value.type === "doc" &&
    Array.isArray(value.content) &&
    value.content.length > 0
  );
}

function getProductImages(product: IPublishedProduct) {
  const images = [
    product.primaryImage,
    ...(Array.isArray(product.gallery) ? product.gallery : []),
  ].filter((image): image is IProductImage =>
    Boolean(image && getProductImageUrl(image.url)),
  );

  return images.filter(
    (image, index, allImages) =>
      allImages.findIndex((item) => item.url === image.url) === index,
  );
}

function getStockStatus(quantity: number, threshold: number) {
  if (quantity <= 0) {
    return {
      label: "Currently out of stock",
      dot: "bg-red-500",
      pill: "bg-red-50 text-red-700",
    };
  }

  if (quantity <= threshold) {
    return {
      label: `Low stock · only ${quantity} left`,
      dot: "bg-amber-500",
      pill: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: `In stock · ${quantity} available`,
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700",
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getPublishedProductBySlug(slug);

    const seo = product.seo;

    const title = seo?.metaTitle?.trim() || `${product.name} | Enviroshield`;

    const description = getProductDescription(product);

    const canonical = `${siteUrl}/products/${product.slug}`;

    const keywords = seo?.keywords?.filter(Boolean) ?? [];

    const ogTitle = seo?.ogTitle?.trim() || title;

    const ogDescription = seo?.ogDescription?.trim() || description;

    const ogImage = seo?.ogImage?.trim() || product.primaryImage?.url;

    const imageAlt = product.primaryImage?.alt?.trim() || product.name;

    return {
      title,
      description,
      keywords,

      alternates: {
        canonical,
      },

      robots: {
        index: seo?.noIndex !== true,
        follow: seo?.noIndex !== true,
        googleBot: {
          index: seo?.noIndex !== true,
          follow: seo?.noIndex !== true,
        },
      },

      openGraph: {
        title: ogTitle,
        description: ogDescription,
        type: "website",
        url: canonical,
        images: [
          {
            url: ogImage,
            alt: imageAlt,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
    };
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "Product not found.") {
      throw error;
    }

    return {
      title: "Product not found | Enviroshield",
      description: "The requested Enviroshield product could not be found.",

      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }
}

export async function generateStaticParams() {
  try {
    const result = await getPublishedProducts({
      page: 1,
      limit: 100,
    });

    return result.data.map((product) => ({
      slug: product.slug,
    }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: IPublishedProduct | null = null;

  try {
    product = await getPublishedProductBySlug(slug);
  } catch (error) {
    if (!(error instanceof Error) || error.message !== "Product not found.") {
      throw error;
    }
  }

  // Only published API products can render.
  // A missing product must return a real 404.
  if (!product) {
    notFound();
  }

  const categoryName = product.categoryId?.name || "Product";

  const images = getProductImages(product);
  const description = getProductDescription(product);
  const price = formatPrice(product.price);
  const articleUrl = `${siteUrl}/products/${product.slug}`;

  const stockQuantity = Number.isFinite(product.stockQuantity)
    ? Math.max(0, product.stockQuantity)
    : 0;

  const lowStockThreshold = Number.isFinite(product.lowStockThreshold)
    ? Math.max(0, product.lowStockThreshold)
    : 0;

  const available = stockQuantity > 0;

  const stock = getStockStatus(stockQuantity, lowStockThreshold);

  const publishedDate = product.publishedAt
    ? new Date(product.publishedAt)
    : null;

  const publishedOn =
    publishedDate && !Number.isNaN(publishedDate.getTime())
      ? publishedDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  // Related products from the same category.
  let related: Awaited<ReturnType<typeof getPublishedProducts>>["data"] = [];

  try {
    const categoryId =
      typeof product.categoryId === "object" ? product.categoryId._id : "";

    if (categoryId) {
      const result = await getPublishedProducts({
        page: 1,
        limit: 4,
        categoryId,
      });

      related = result.data
        .filter((item) => item._id !== product._id)
        .slice(0, 3);
    }
  } catch {
    related = [];
  }

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${articleUrl}#product`,

    name: product.name,
    description,
    url: articleUrl,

    ...(product.sku?.trim() ? { sku: product.sku.trim() } : {}),

    ...(images.length > 0
      ? {
          image: images.map((image) => image.url),
        }
      : {}),

    category: categoryName,

    brand: {
      "@type": "Brand",
      name: "Enviroshield",
    },

    ...(price
      ? {
          offers: {
            "@type": "Offer",
            url: articleUrl,
            price: product.price,
            priceCurrency: "BDT",

            availability: available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

            seller: {
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: "Enviroshield",
              url: siteUrl,
            },
          },
        }
      : {}),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${articleUrl}#webpage`,

    url: articleUrl,
    name: product.seo?.metaTitle?.trim() || product.name,
    description,

    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Enviroshield",
    },

    about: {
      "@id": `${articleUrl}#product`,
    },

    breadcrumb: {
      "@id": `${articleUrl}#breadcrumb`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${articleUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: articleUrl,
      },
    ],
  };

  const tdsLinkClass =
    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-[13px] font-bold text-navy transition-colors hover:border-blue hover:text-blue";

  const tdsUrl = getTrustedTdsUrl(product.tdsUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* PRODUCT HEADER */}

      <header className="relative overflow-hidden pt-[72px] max-[900px]:pt-14 max-[600px]:pt-10">
        <Container>
          <Reveal dir="up">
            <div className="relative mx-auto max-w-[1120px]">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-ink transition-colors hover:text-blue"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  All products
                </Link>

                <nav
                  aria-label="Breadcrumb"
                  className="text-[13px] text-ink/60"
                >
                  <ol className="flex flex-wrap items-center gap-2">
                    <li>
                      <Link href="/" className="hover:text-blue">
                        Home
                      </Link>
                    </li>

                    <li aria-hidden="true">/</li>

                    <li>
                      <Link href="/products" className="hover:text-blue">
                        Products
                      </Link>
                    </li>

                    <li aria-hidden="true">/</li>

                    <li
                      className="max-w-[220px] truncate font-semibold text-navy"
                      aria-current="page"
                    >
                      {product.name}
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue/10 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.1em] text-blue">
                  {categoryName}
                </span>

                {product.isFeatured && (
                  <span className="rounded-full bg-blue px-4 py-2 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(1,110,220,0.3)]">
                    Featured product
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold ${stock.pill}`}
                >
                  <span className={`size-2 rounded-full ${stock.dot}`} />
                  {available ? "In stock" : "Out of stock"}
                </span>
              </div>

              <h1 className="max-w-[900px] text-[clamp(36px,5.4vw,64px)] font-extrabold leading-[1.06] tracking-[-0.045em] text-navy">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-6 max-w-[780px] text-[clamp(18px,2.2vw,23px)] leading-[1.65] text-ink/80">
                  {product.shortDescription}
                </p>
              )}
            </div>
          </Reveal>
        </Container>
      </header>

      {/* PRODUCT OVERVIEW */}

      <section
        aria-label="Product overview"
        className="pb-16 pt-12 max-[900px]:pb-12 max-[600px]:pt-8"
      >
        <Container>
          <div className="mx-auto grid max-w-[1120px] grid-cols-[1.05fr_0.95fr] items-start gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-9">
            {/* Images */}

            <Reveal dir="image">
              <ProductGallery images={images} name={product.name} />
            </Reveal>

            {/* Product information */}

            <Reveal dir="up" delay={0.12}>
              <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_10px_40px_rgba(0,51,78,0.07)] min-[901px]:sticky min-[901px]:top-28">
                {/* Price header */}

                <div className="border-b border-line p-7 max-[600px]:p-5">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                    Product information
                  </p>

                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60">
                        Price
                      </p>

                      <p className="mt-1 text-[36px] font-extrabold leading-none tracking-[-0.035em] text-navy">
                        {price || "Contact for pricing"}
                      </p>
                    </div>
                  </div>

                  {!price && (
                    <p className="mt-2 text-[13px] text-ink/60">
                      Contact our team for current pricing.
                    </p>
                  )}

                  <span
                    className={`mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-bold ${stock.pill}`}
                  >
                    <span className={`size-2 rounded-full ${stock.dot}`} />
                    {stock.label}
                  </span>
                </div>

                <div className="p-7 max-[600px]:p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted p-4">
                      <div className="mb-2 flex items-center gap-2 text-ink/60">
                        <Tag size={16} aria-hidden="true" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                          SKU
                        </span>
                      </div>

                      <p className="break-words text-[14px] font-bold text-navy">
                        {product.sku || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted p-4">
                      <div className="mb-2 flex items-center gap-2 text-ink/60">
                        <Scale size={16} aria-hidden="true" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                          Weight
                        </span>
                      </div>

                      <p className="break-words text-[14px] font-bold text-navy">
                        {product.weight > 0
                          ? `${product.weight} kg`
                          : "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted p-4">
                      <div className="mb-2 flex items-center gap-2 text-ink/60">
                        <Layers size={16} aria-hidden="true" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                          Category
                        </span>
                      </div>

                      <p className="break-words text-[14px] font-bold text-navy">
                        {categoryName}
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted p-4">
                      <div className="mb-2 flex items-center gap-2 text-ink/60">
                        <CalendarDays size={16} aria-hidden="true" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                          Listed
                        </span>
                      </div>

                      <p className="break-words text-[14px] font-bold text-navy">
                        {publishedOn || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    {price ? (
                      <AddToCart product={product} stock={stockQuantity} />
                    ) : (
                      <Button href="/contact" fullWidth>
                        Ask about this product
                      </Button>
                    )}

                    {tdsUrl && (
                      <a
                        href={tdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open technical data sheet for ${product.name} in a new tab`}
                        className={tdsLinkClass}
                      >
                        <FileText size={17} aria-hidden="true" />
                        View TDS
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    )}
                  </div>

                  <p className="mt-5 text-center text-[12px] leading-6 text-ink/60">
                    Questions about specifications, bulk orders or suitability?
                    Our team is happy to help.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FULL RICH DESCRIPTION */}

      <section
        aria-labelledby="product-description-heading"
        className="border-t border-line py-[88px] max-[900px]:py-16 max-[600px]:py-12"
      >
        <Container>
          <div className="mx-auto max-w-[1120px]">
            <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-16 max-[1000px]:grid-cols-1 max-[1000px]:gap-10">
              {/* Story */}

              <Reveal dir="up">
                <div className="min-w-0">
                  <p className="mb-4 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                    <span aria-hidden="true" className="h-[2px] w-7 bg-blue" />
                    Product details
                  </p>

                  <h2
                    id="product-description-heading"
                    className="max-w-[720px] text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy"
                  >
                    About {product.name}
                  </h2>

                  {product.shortDescription && (
                    <p className="mt-7 max-w-[680px] border-l-[3px] border-blue pl-5 text-[19px] leading-[1.7] text-navy/90 max-[600px]:text-[17px]">
                      {product.shortDescription}
                    </p>
                  )}

                  <div className="mt-10 max-w-[720px] border-t border-line pt-10">
                    {hasRichContent(product.description) ? (
                      <BlogContent content={product.description} />
                    ) : (
                      <p className="text-[16px] leading-[1.85] text-ink">
                        {product.shortDescription ||
                          "More product information will be available soon."}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Specification sheet */}

              <Reveal dir="up" delay={0.1}>
                <aside
                  aria-label="Product specifications"
                  className="overflow-hidden rounded-[16px] border border-line bg-white min-[1001px]:sticky min-[1001px]:top-28"
                >
                  <div className="bg-navy px-6 py-4">
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-white">
                      Specifications
                    </p>
                  </div>

                  <dl className="divide-y divide-line px-6">
                    {[
                      {
                        label: "Category",
                        value: categoryName,
                      },
                      {
                        label: "SKU",
                        value: product.sku || "Not specified",
                      },
                      {
                        label: "Pack weight",
                        value:
                          product.weight > 0
                            ? `${product.weight} kg`
                            : "Not specified",
                      },
                      {
                        label: "Price",
                        value: price || "Contact for pricing",
                      },
                      {
                        label: "Availability",
                        value: available ? "In stock" : "Out of stock",
                      },
                      ...(publishedOn
                        ? [
                            {
                              label: "Listed",
                              value: publishedOn,
                            },
                          ]
                        : []),
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-6 py-3.5"
                      >
                        <dt className="text-[13px] text-ink/60">{row.label}</dt>

                        <dd className="break-words text-right text-[14px] font-bold text-navy">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {tdsUrl && (
                    <div className="border-t border-line p-4">
                      <a
                        href={tdsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open technical data sheet for ${product.name} in a new tab`}
                        className="group flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-blue"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue text-white">
                          <FileText size={18} aria-hidden="true" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-bold text-navy">
                            Technical data sheet
                          </span>

                          <span className="block text-[12px] text-ink/60">
                            View TDS
                          </span>
                        </span>

                        <ArrowUpRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-ink/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue"
                        />
                      </a>
                    </div>
                  )}
                </aside>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* RELATED PRODUCTS */}

      {related.length > 0 && (
        <section
          aria-labelledby="related-products-heading"
          className="border-t border-line bg-muted/50 py-[88px] max-[900px]:py-16 max-[600px]:py-12"
        >
          <Container>
            <div className="mx-auto max-w-[1120px]">
              <Reveal dir="up">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="mb-4 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-7 bg-blue"
                      />
                      You may also like
                    </p>

                    <h2
                      id="related-products-heading"
                      className="text-[clamp(28px,3.6vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-navy"
                    >
                      More from {categoryName}
                    </h2>
                  </div>

                  <Link
                    href={`/products?categoryId=${
                      typeof product.categoryId === "object"
                        ? product.categoryId._id
                        : ""
                    }`}
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-blue transition-colors hover:text-deep"
                  >
                    View all
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>

              <div className="grid grid-cols-3 gap-6 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
                {related.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* CONTACT CTA */}

      <section
        aria-label="Talk to our product team"
        className="py-[96px] max-[900px]:py-16"
      >
        <Container>
          <div className="relative flex items-center justify-between gap-8 overflow-hidden rounded-[20px] bg-navy p-12 max-[900px]:flex-col max-[900px]:items-start max-[900px]:p-8 max-[600px]:p-6">
            <div className="relative max-w-[650px]">
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-paste">
                Need more information?
              </p>

              <h2 className="text-[clamp(27px,3.4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-white">
                Find the right solution for your project.
              </h2>

              <p className="mt-4 text-[15px] leading-[1.8] text-white/75">
                Talk to our team about this product, its specifications,
                pricing, and suitability for your project.
              </p>
            </div>

            <div className="relative flex shrink-0 flex-wrap gap-3">
              <Button href="/contact" variant="light">
                Contact our team
              </Button>

              <Link
                href="/products"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-[13px] font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                More products
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
