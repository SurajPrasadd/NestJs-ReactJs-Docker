import { refundPayment } from "../api/razorpay";

const RefundButton = ({ paymentId }) => {
  const handleRefund = async () => {
    const res = await refundPayment(paymentId, 100); // refund ₹100
    alert("Refund Done: " + JSON.stringify(res));
  };

  return <button onClick={handleRefund}>Refund ₹100</button>;
};

export default RefundButton;
