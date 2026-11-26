import { getPublishedProducts } from "@/lib/api/products";
import { IPublishedProduct } from "@/types";
import ProductsSectionContent from "./ProductsSectionContent";

export default async function ProductsSection() {
  let products: IPublishedProduct[] = [];

  try {
    const result = await getPublishedProducts({
      page: 1,
      limit: 8,
    });

    products = result.data;
  } catch (error) {
    console.error("Failed to load homepage products:", error);
  }

  return <ProductsSectionContent products={products} />;
}
