import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CreditCard, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PaystackButton } from "react-paystack";

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
    publicKey: "pk_test_your_paystack_public_key_here", // Replace with your Paystack public key
    channels: ["mobile_money"], // Force M-Pesa for Kenyan users
  };

  const handlePaystackSuccess = (reference: { reference: string }) => {
    toast({
      title: "Payment Successful!",
      description: `Transaction ${reference.reference} completed successfully.`,
    });
    onSuccess();
    onClose();
  };

  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "Payment was cancelled. You can try again.",
      variant: "destructive",
    });
  };

  const componentProps = {
    ...paystackConfig,
    text: `Pay KSh ${amount} via M-Pesa`,
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Paystack M-Pesa Payment
          </DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> You need to add your Paystack public key to the code.
            Replace "pk_test_your_paystack_public_key_here" with your actual key.
          </AlertDescription>
        </Alert>

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
            Clicking the button below will open Paystack's secure payment page.
            Select M-Pesa as your payment method and follow the prompts.
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <PaystackButton
            {...componentProps}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPaymentModal;