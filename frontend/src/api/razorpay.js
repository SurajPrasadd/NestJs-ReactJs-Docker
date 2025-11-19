import API from "./client"; // 👈 your axios instance with interceptor

// Create Razorpay Order
export const createRazorpayOrder = async (payload) => {
  const res = await API.post("/payment/create", payload);
  return res.data;
};

// Verify Payment
export const verifyPayment = async (payload) => {
  const res = await API.post("/payment/verify", payload);
  return res.data;
};

export const refundPayment = async (paymentId, amount) => {
  const res = await API.post("/payments/refund", {
    paymentId,
    amount,
  });
  return res.data;
};

// Get Payment Status
export const getPaymentStatus = async (paymentId) => {
  const res = await API.get(`/payments/status/${paymentId}`);
  return res.data;
};
