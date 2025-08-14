// Mock Payment Service

const processPayment = async (amount) => {
  console.log(`Processing payment of $${amount}`);
  // In a real application, this would interact with a payment gateway like Stripe or PayPal
  return { success: true, transactionId: `txn_${Date.now()}` };
};

module.exports = {
  processPayment,
};
