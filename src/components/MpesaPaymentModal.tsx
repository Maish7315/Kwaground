import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CreditCard, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
  onSuccess: () => void;
}

const MpesaPaymentModal = ({ isOpen, onClose, amount, planName, onSuccess }: MpesaPaymentModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Paystack configuration - Replace with your actual public key
  const paystackConfig = {
    reference: `KWA-${Date.now()}`,
    email: user?.email || "customer@example.com",
    amount: amount * 100, // Paystack expects amount in kobo (multiply by 100)
    currency: "KES",
    publicKey: "pk_test_f90bcd3c9d65fcf3cd75613000d9ac33dbb6ddc8", // Your Paystack public key
    channels: ["mobile_money"], // Force M-Pesa for Kenyan users
  };

  const handlePaystackSuccess = (reference: { reference: string }) => {
    console.log("Payment successful:", reference);
    toast({
      title: "Payment Successful!",
      description: `Transaction ${reference.reference} completed successfully.`,
    });
    onSuccess();
    onClose();
  };

  const handlePaystackClose = () => {
    console.log("Payment closed/cancelled");
    toast({
      title: "Payment Cancelled",
      description: "Payment was cancelled. You can try again.",
      variant: "destructive",
    });
  };

  const handlePaymentClick = () => {
    console.log("Payment button clicked, opening Paystack");
    // Check if Paystack is available
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      console.log("Paystack is available");
    } else {
      console.error("Paystack not loaded");
      toast({
        title: "Payment Error",
        description: "Payment system not loaded. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };


  const handlePayment = () => {
    console.log("Initiating Paystack payment");

    if (typeof window === 'undefined') {
      toast({
        title: "Error",
        description: "Payment system not available.",
        variant: "destructive",
      });
      return;
    }

    const paystack = (window as any).PaystackPop;

    if (!paystack) {
      console.error("Paystack not loaded");
      toast({
        title: "Payment Error",
        description: "Payment system not loaded. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const handler = paystack.setup({
      ...paystackConfig,
      onSuccess: handlePaystackSuccess,
      onClose: handlePaystackClose,
    });

    // Try popup first, fallback to iframe if popup fails
    try {
      handler.openPopup();
    } catch (error) {
      console.log("Popup failed, trying iframe:", error);
      handler.openIframe();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            M-Pesa Payment
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Complete your payment for {planName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-semibold">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">KSh {amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-semibold">{user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Clicking the button below will open a secure payment popup.
            Select M-Pesa as your payment method and follow the prompts on your phone.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handlePayment} className="flex-1">
            Pay KSh {amount} via M-Pesa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPaymentModal;