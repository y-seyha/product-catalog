import { type FormEvent, type ChangeEvent, useState } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  onSale: boolean;
  category?: string;
}

export type PublicProduct = Omit<Product, "id">;

export interface ProductForm {
  name: string;
  price: string;
}

export type FormDraft = Partial<ProductForm>;

export interface FormErrors {
  name: string;
  price: string;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const categoryName = product?.category ?? "General";

  return (
    <article className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div>
        <div className="flex justify-between items-start gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {product.name}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Category: {categoryName}
            </span>
          </div>
          {product.onSale && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded border border-red-100 shrink-0">
              Sale
            </span>
          )}
        </div>
        <p className="text-xl font-bold text-slate-800 mt-2">
          ${product.price?.toLocaleString() ?? "0"}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            product.inStock
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.inStock ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {product.inStock ? "In stock" : "Sold out"}
        </span>
      </div>
    </article>
  );
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 1200,
    inStock: true,
    onSale: true,
    category: "Electronics",
  },
  { id: 2, name: "Wireless Mouse", price: 35, inStock: true, onSale: false },
  {
    id: 3,
    name: "Keyboard",
    price: 80,
    inStock: false,
    onSale: true,
    category: "Peripherals",
  },
  { id: 4, name: "Monitor", price: 300, inStock: true, onSale: false },
];

function App() {
  const [products, setProducts] = useState<Product[] | null>(initialProducts);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const [form, setForm] = useState<FormDraft>({ name: "", price: "" });
  const [errors, setErrors] = useState<FormErrors>({ name: "", price: "" });

  const safeProducts = products ?? [];

  const displayedProducts = inStockOnly
    ? safeProducts.filter((product) => product.inStock)
    : safeProducts;

  const saleCount = safeProducts.filter((product) => product.onSale).length;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, price: e.target.value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInStockOnly(e.target.checked);
  };

  const createPublicProductPayload = (draft: FormDraft): PublicProduct => {
    return {
      name: (draft.name ?? "").trim(),
      price: Number(draft.price),
      inStock: true,
      onSale: false,
    };
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = { name: "", price: "" };

    const rawName = form.name ?? "";
    const rawPrice = form.price ?? "";

    if (rawName.trim() === "") {
      newErrors.name = "Product name is required.";
    }

    if (rawPrice.trim() === "" || Number.isNaN(Number(rawPrice))) {
      newErrors.price = "Price must be a valid number.";
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.price) {
      return;
    }

    // Prepare product payload using PublicProduct (no ID required yet)
    const publicData: PublicProduct = createPublicProductPayload(form);

    const newProduct: Product = {
      id: Date.now(),
      ...publicData,
    };

    setProducts((currentProducts) =>
      currentProducts ? [...currentProducts, newProduct] : [newProduct],
    );

    setForm({ name: "", price: "" });
    setErrors({ name: "", price: "" });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Product Catalog
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {safeProducts.length} products total
              </p>
            </div>

            <div className="flex items-center gap-3">
              {saleCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span>🔥</span> {saleCount} on sale
                </span>
              )}

              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                In stock only
              </label>
            </div>
          </div>
        </header>
        // BUG PLANTED: Passing 'item' instead of 'product'
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </section>
        {/* --Solutions  */}
        {/* <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section> */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Product Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Mechanical Keyboard"
                value={form.name ?? ""}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                placeholder="0.00"
                value={form.price ?? ""}
                onChange={handlePriceChange}
                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
                  errors.price
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-600">{errors.price}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default App;
