"use client";

import { useParams } from "next/navigation";
import Home from "../pages/Home";
import Salons from "../pages/Salons";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BusinessLogin from "../pages/BusinessLogin";
import ProductDetailPage from "../pages/ProductDetail";
import ProductsPage from "../pages/Products";
import SalonDetail from "../pages/SalonDetail";
import FavoritesPage from "../pages/Favorite";
import CartPage from "../pages/Cart";
export default function CentralRouter() {
  const params = useParams();

  const slug = params.slug as string[] | undefined;

  if (!slug || slug.length === 0) {
    return <Home />;
  }

  const currentRoute = slug[0];
  const dynamicId = slug[1] || "1";

  const salonParams = Promise.resolve({ id: dynamicId }) as any;
  const productParams = { id: dynamicId } as any;

  switch (currentRoute) {
    case "salons":
      if (slug.length > 1) {
        return <SalonDetail params={salonParams} />;
      }
      return <Salons />;

    case "products":
      if (slug.length > 1) {
        return <ProductDetailPage params={productParams} />;
      }
      return <ProductsPage />;

    case "productdetail":
      return <ProductDetailPage params={productParams} />;

    case "salondetail":
      return <SalonDetail params={salonParams} />;

    case "login":
      return <Login />;

    case "register":
      return <Register />;

    case "favorites":
      return <FavoritesPage />;

    case "cart":
      return <CartPage />;

    case "business-login":
      return <BusinessLogin />;

    default:
      return <Home />;
  }
}
