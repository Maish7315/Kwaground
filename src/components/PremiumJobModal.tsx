import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "./LoginModal";
import MpesaPaymentModal from "./MpesaPaymentModal";

interface PremiumJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumJobModal = ({ isOpen, onClose }: PremiumJobModalProps) => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic Post",
      price: 100,
      description: "Standard job posting",
      features: [
        "Posted for 7 days",
        "Basic visibility",
        "Email notifications",
        "Basic support"
      ],
      icon: Check,
      popular: false
    },
    {
      id: "premium",
      name: "Premium Post",
      price: 500,
      description: "Enhanced visibility & features",
      features: [
        "Posted for 30 days",
        "Featured placement",
        "Priority notifications",
        "Analytics dashboard",
        "Premium support",
        "Top search results"
      ],
      icon: Star,
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 2000,
      description: "Maximum reach & support",
      features: [
        "Posted for 90 days",
        "Top featured placement",
        "Dedicated account manager",
        "Custom branding",
        "Advanced analytics",
        "24/7 priority support",
        "Bulk posting discount"
      ],
      icon: Crown,
      popular: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceed = () => {
    if (!selectedPlan) {
      toast({
        title: "Select a Plan",
        description: "Please select a posting plan to continue.",
        variant: "destructive",
      });
      return;
    }

    // Check authentication for paid plans
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);

    if (plan?.price === 0) {
      // Basic plan - proceed to post
      toast({
        title: "Basic Plan Selected",
        description: "Redirecting to job posting form...",
      });
      // Here you would open the PostJobModal
      onClose();
    } else {
      // Paid plan - proceed to payment
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    toast({
      title: "Payment Completed!",
      description: `Your ${plan?.name} plan is now active. You can now post your job.`,
    });
    // Here you would open the PostJobModal with the paid plan
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Zap className="w-5 h-5" />
            Choose Your Job Posting Plan
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            Select the plan that best fits your hiring needs
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "ring-2 ring-primary border-primary"
                  : "hover:shadow-lg"
              } ${plan.popular ? "border-primary" : ""}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <plan.icon className={`w-8 h-8 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">
                  {plan.price === 0 ? "Free" : `KSh ${plan.price}`}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleProceed} className="flex-1" disabled={!selectedPlan}>
            {selectedPlan === "basic" ? "Post Job" : "Proceed to Payment"}
          </Button>
        </div>

        {selectedPlan && selectedPlan !== "basic" && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Payment Information</h4>
            <p className="text-sm text-muted-foreground mb-2">
              You'll be redirected to M-Pesa STK Push for secure payment.
            </p>
            <p className="text-sm">
              <strong>Note:</strong> Payment is required before your job posting goes live.
              Refunds are not available once the posting period begins.
            </p>
          </div>
        )}

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            // After login, proceed with the selected plan
            handleProceed();
          }}
        />

        {selectedPlan && (
          <MpesaPaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={plans.find(p => p.id === selectedPlan)?.price || 0}
            planName={plans.find(p => p.id === selectedPlan)?.name || ''}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumJobModal;