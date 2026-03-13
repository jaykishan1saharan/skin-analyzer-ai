import { useState, useEffect } from 'react';
import { ShoppingBag, Search } from 'lucide-react';

export default function Products({ user }: { user: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/recommend?skin_type=${user.skin_type}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, [user.skin_type]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-neutral-500">Loading products...</div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Recommended Products</h1>
        <p className="text-neutral-500 mt-1">Curated skincare products suitable for your {user.skin_type} skin type.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-48 bg-neutral-100 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-neutral-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-2">
                {product.category}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{product.name}</h3>
              <p className="text-neutral-600 text-sm flex-1 mb-4">{product.description}</p>
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-500">
                  <span className="font-medium text-neutral-700">Suitable for:</span> {product.suitable_for}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
