import Image from "next/image";

import Link from "next/link";

export function ProductCard({ product }: { product: any }) {
  return (
    <article className="overflow-hidden rounded-[16px] border border-line bg-white">
      <div className="relative h-[230px]">
        <Image
          src={product.image}
          alt={`${product.name} - ${product.category}`}
          fill
          sizes="(max-width: 600px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue">
          {product.category}
        </span>

        <h3 className="my-[7px] text-[20px] text-navy">
          {product.name}
        </h3>

        <p className="mb-[14px] text-[13px] leading-[1.6] text-ink">
          {product.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {product.features.map((feature: any) => (
            <span
              key={feature}
              className="rounded-[5px] bg-mist px-2 py-[6px] text-[10px] text-navy"
            >
              {feature}
            </span>
          ))}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="group inline-flex items-center gap-[7px] text-[13px] font-extrabold text-navy transition-[gap,color] duration-200 hover:gap-[11px] hover:text-blue"
        >
          View details
        </Link>
      </div>
    </article>
  );
}