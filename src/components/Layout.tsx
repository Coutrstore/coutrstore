import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import CartDrawer from "./CartDrawer";
import ScrollTopButton from "./ScrollTopButton";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-[calc(2.25rem+72px)]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ScrollTopButton />
    </div>
  );
}
