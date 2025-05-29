import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import headphoneImage from '../assets/headphone.jpeg';
import laptopImage from '../assets/laptop.jpeg'; 

const products = [
  {
    id: 'prod_123',
    title: 'Premium Wireless Headphones',
    description: 'Crystal clear sound with noise cancellation and 30-hour battery life.',
    price: 199.99,
    image: headphoneImage,
    variants: {
      color: ['Black', 'White', 'Blue'],
      size: ['Small', 'Medium', 'Large'],
    },
    inventory: 10,
  },
  {
    id: 'prod_124',
    title: 'Ultra HD Laptop',
    description: 'High-performance laptop with 16GB RAM, 1TB SSD, and 4K Display.',
    price: 29999.99,
    image: laptopImage,
    variants: {
      color: ['Gray', 'Silver'],
      size: ['13-inch', '15-inch', '17-inch'],
    },
    inventory: 5,
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleVariantChange = (productId, field, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  };

  const handleQuantityChange = (productId, value) => {
    const product = products.find(p => p.id === productId);
    const clampedValue = Math.max(1, Math.min(product.inventory, parseInt(value) || 1));
    setQuantities(prev => ({ ...prev, [productId]: clampedValue }));
  };

  const handleBuyNow = (product) => {
    const selected = selectedVariants[product.id] || {
      color: product.variants.color[0],
      size: product.variants.size[0],
    };
    const quantity = quantities[product.id] || 1;
    const productData = {
      ...product,
      selectedVariant: selected,
      quantity,
      subtotal: product.price * quantity,
    };
    navigate('/checkout', { state: { product: productData } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl text-white">ShopEase</span>
            </div>
            <div className="flex items-center space-x-4 text-white  ">
              <button className=' hover:text-gray-700'>Home</button>
              <button className=' hover:text-gray-700'>Products</button>
              <button className=' hover:text-gray-700'>About</button>
              <button className=' hover:text-gray-700'>Contact</button>
            </div>
          </div>
        </div>
      </nav>
      <div className="py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map(product => {
          const selected = selectedVariants[product.id] || {
            color: product.variants.color[0],
            size: product.variants.size[0],
          };
          const quantity = quantities[product.id] || 1;
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-contain md:h-full md:w-48"
                    src={product.image}
                    alt={product.title}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                  />
                </div>
                <div className="p-6">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Premium Product</div>
                  <h2 className="text-xl font-bold text-gray-900">{product.title}</h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">${product.price.toFixed(2)}</p>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <select
                      value={selected.color}
                      onChange={(e) => handleVariantChange(product.id, 'color', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      {product.variants.color.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <select
                      value={selected.size}
                      onChange={(e) => handleVariantChange(product.id, 'size', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      {product.variants.size.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={product.inventory}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  <button
                    onClick={() => handleBuyNow(product)}
                    className="mt-6 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 font-medium rounded-lg px-6 py-2" >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPage;
