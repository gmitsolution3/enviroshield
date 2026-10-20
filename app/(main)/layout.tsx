import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import SmoothScroll from "@/components/smooth-scroll";
import { CartProvider } from "@/components/cart/CartProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <SmoothScroll>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
    </CartProvider>
  );
}
