import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle, Clock, AlertTriangle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
  onSuccess: () => void;
}

const MpesaPaymentModal = ({ isOpen, onClose, amount, planName, onSuccess }: MpesaPaymentModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'phone' | 'confirm' | 'processing' | 'success' | 'failed'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('phone');
      setPhoneNumber('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    return phoneRegex.test(cleanPhone);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) {
      return '+254' + cleanPhone.substring(1);
    }
    return cleanPhone;
  };

  const handlePhoneSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number.",
        variant: "destructive",
      });
      return;
    }

    setStep('confirm');
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setStep('processing');

    // Simulate STK Push delay
    setTimeout(() => {
      // Simulate success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setStep('success');
        setIsLoading(false);
        toast({
          title: "Payment Successful!",
          description: `KSh ${amount} has been received for ${planName}.`,
        });

        // Close modal after success
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 3000);
      } else {
        setStep('failed');
        setIsLoading(false);
        toast({
          title: "Payment Failed",
          description: "Payment was cancelled or failed. Please try again.",
          variant: "destructive",
        });
      }
    }, 5000); // 5 second delay to simulate STK Push
  };

  const handleRetry = () => {
    setStep('phone');
    setPhoneNumber('');
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          Enter your M-Pesa registered phone number to receive the STK Push payment prompt.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          M-Pesa Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="e.g., 0712345678 or +254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground">
          We'll send a payment prompt to this number
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Payment Summary</h4>
        <div className="flex justify-between items-center">
          <span>{planName}</span>
          <span className="font-bold text-lg">KSh {amount}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          M-Pesa charges may apply
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handlePhoneSubmit} className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Confirm Payment Details</strong>
          <br />
          Amount: KSh {amount}
          <br />
          Phone: {formatPhoneNumber(phoneNumber)}
          <br />
          Plan: {planName}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            STK Push Payment
          </CardTitle>
          <CardDescription>
            A payment prompt will be sent to your phone. Enter your M-Pesa PIN when prompted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure payment through M-Pesa</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant payment confirmation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No hidden charges</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => setStep('phone')} className="flex-1">
          Back
        </Button>
        <Button onClick={handleConfirmPayment} className="flex-1" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send STK Push"}
        </Button>
      </div>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
        <p className="text-muted-foreground">
          Sending STK Push to {formatPhoneNumber(phoneNumber)}...
        </p>
      </div>

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Check your phone!</strong> Enter your M-Pesa PIN when the payment prompt appears.
          This may take a few seconds.
        </AlertDescription>
      </Alert>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm">
          <strong>Amount:</strong> KSh {amount}
          <br />
          <strong>Recipient:</strong> KwaGround Services
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-green-600">Payment Successful!</h3>
        <p className="text-muted-foreground">
          KSh {amount} has been received from {formatPhoneNumber(phoneNumber)}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-semibold">{planName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-semibold">KSh {amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono text-sm">MP{Date.now()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Badge variant="secondary" className="w-full justify-center py-2">
        Redirecting to job posting...
      </Badge>
    </div>
  );

  const renderFailedStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-red-600">Payment Failed</h3>
        <p className="text-muted-foreground">
          The payment could not be completed. Please try again.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Possible reasons:
          <br />• Insufficient balance
          <br />• Incorrect PIN entered
          <br />• Network issues
          <br />• Payment timeout
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleRetry} className="flex-1">
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            M-Pesa Payment
          </DialogTitle>
        </DialogHeader>

        {step === 'phone' && renderPhoneStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'success' && renderSuccessStep()}
        {step === 'failed' && renderFailedStep()}
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPaymentModal;