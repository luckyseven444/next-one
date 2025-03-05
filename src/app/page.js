import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import { CartProvider } from "../context/CartContext";

export default function Home() {
  return (
    <CartProvider>
      <Cart />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <ProductList />
      </div>
    </CartProvider>
  );
}
