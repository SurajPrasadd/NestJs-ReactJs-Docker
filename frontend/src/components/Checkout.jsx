import React from "react";
import { createRazorpayOrder, verifyPayment } from "../api/razorpay";
import { useRazorpay } from "./useRazorpay";

const Checkout = () => {
  const razorpayLoaded = useRazorpay();

  const payNow = async () => {
    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded yet!");
      return;
    }

    const razorOrder = await createRazorpayOrder({ orderId: 1 });

    const options = {
      key: razorOrder.key,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      name: razorOrder.name,
      order_id: razorOrder.razorpayOrderId,

      handler: async (response) => {
        const verifyRes = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        alert(
          "Payment Verified: " +
            JSON.stringify(verifyRes) +
            "\nResponse: " +
            JSON.stringify(response)
        );
      },
    };

    const razor = new window.Razorpay(options); // ← NOW it works
    razor.open();
  };

  return (
    <div>
      <button onClick={payNow}>Pay ₹550</button>
    </div>
  );
};

export default Checkout;
