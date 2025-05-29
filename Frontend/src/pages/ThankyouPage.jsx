import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  
  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
             <span className="text-xl font-semibold text-white">ShopEase</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium" >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
          {order.status === 'approved' ? (
            <>
              <div className="bg-gray-800 px-6 py-8 text-center">
                <h1 className="text-3xl font-bold text-white">Thank You for Your Order!</h1>
                <p className="mt-2 text-indigo-200">
                  Your order has been confirmed and will be shipped soon.
                </p>
              </div>
              
              <div className="px-6 py-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-medium">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-green-600 capitalize">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">${order.product.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                        <img 
                          src={order.product.image} 
                          alt={order.product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{order.product.title}</h3>
                        <p className="text-gray-500">{order.product.selectedVariant.color}, {order.product.selectedVariant.size}</p>
                        <p className="text-gray-500">Qty: {order.product.quantity}</p>
                      </div>
                      <div className="ml-auto font-medium">
                        ${order.product.subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                      <p className="font-medium">{order.fullName}</p>
                      <p className="text-gray-600">{order.email}</p>
                      <p className="text-gray-600">{order.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                      <p className="font-medium">{order.fullName}</p>
                      <p className="text-gray-600">{order.address}</p>
                      <p className="text-gray-600">{order.city}, {order.state} {order.zipCode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Paid</span>
                    <span className="text-xl font-bold">${order.product.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-smtext-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 "
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-600 px-6 py-8 text-center">
                <h1 className="text-3xl font-bold text-white">Order Processing Issue</h1>
                <p className="mt-2 text-red-100">
                  We encountered an issue processing your payment. Your order was not completed.
                </p>
              </div>
              
              <div className="px-6 py-8">
                {order.status === 'declined' && (
                  <div className="mb-6 p-4 bg-red-50 rounded-md">
                    <p className="text-red-800">Your payment was declined. Please check your payment information and try again.</p>
                  </div>
                )}
                
                {order.status === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 rounded-md">
                    <p className="text-red-800">There was an error processing your payment. Please try again later.</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Reference</h2>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-6 text-center">
                  <button
                    onClick={() => navigate('/checkout', { state: { product: order.product } })}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;