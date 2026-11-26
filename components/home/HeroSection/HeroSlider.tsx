import { getPublishedProducts } from "@/lib/api/products";
import { resolveDynamicHeroSlides } from "@/lib/hero/slides";
import type { IPublishedProduct } from "@/types/product.type";
import HeroSliderContent from "./HeroSliderContent";

export default async function HeroSlider() {
  let products: IPublishedProduct[] = [];

  try {
    const result = await getPublishedProducts({ limit: 25 });
    products = result.data || [];
  } catch (error) {
    console.error("Failed to fetch products for hero slider dynamic lens:", error);
  }

  const slides = resolveDynamicHeroSlides(products);

  return <HeroSliderContent initialSlides={slides} />;
}
