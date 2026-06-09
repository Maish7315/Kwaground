import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('pendingJobData');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Payment Cancelled</h2>
        <p className="text-muted-foreground">Your payment was cancelled. You can try again.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;