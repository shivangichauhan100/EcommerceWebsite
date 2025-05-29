// Simulate payment processing
exports.processPayment = async (paymentDetails, amount) => {
  // In a real app, this would connect to Stripe, PayPal, etc.
  
  // Simulate different outcomes randomly
  const outcomes = [
    { status: 'approved', message: 'Payment approved' },
    { status: 'declined', message: 'Payment declined' },
    { status: 'error', message: 'Payment processing error' }
  ];
  
  // 80% chance of approval, 15% decline, 5% error
  const rand = Math.random();
  let result;
  
  if (rand > 0.95) {
    result = outcomes[2]; // error
  } else if (rand > 0.8) {
    result = outcomes[1]; // declined
  } else {
    result = outcomes[0]; // approved
  }
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return result;
};