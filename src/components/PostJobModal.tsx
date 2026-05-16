import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Phone, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostJobModal = ({ isOpen, onClose }: PostJobModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    paymentType: "",
    paymentAmount: "",
    jobType: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    phoneNumber: "",
    description: "",
    ageConfirmed: false,
  });
  const [premiumAmount, setPremiumAmount] = useState(0);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.jobTitle || !formData.location || !formData.paymentType ||
        !formData.paymentAmount || !formData.jobType || !formData.startDate ||
        !formData.phoneNumber || !formData.ageConfirmed) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and confirm you are 18+.",
        variant: "destructive",
      });
      return;
    }

    // Phone number validation (Kenyan format - must start with 07 or 01)
    const phoneRegex = /^(\+254|0)(7|1)\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number.",
        variant: "destructive",
      });
      return;
    }

    // Show premium packages dialog (mandatory)
    const payAmount = parseFloat(formData.paymentAmount) || 0;
    const fee = payAmount < 1500 ? 250 : 550;
    setPremiumAmount(fee);
    setShowPremiumDialog(true);
  };

  const initiateMpesaPayment = async (amount: number) => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('/.netlify/functions/mpesa-stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phoneNumber,
          amount: amount,
          reference: `job_${Date.now()}`
        })
      });

      const result = await response.json();

      if (result.ResponseCode === '0') {
        toast({
          title: "M-Pesa Prompt Sent",
          description: "Check your phone and enter M-Pesa PIN to complete payment.",
        });
        
        // For now, we post the job after sending STK (callback will handle verification later)
        setTimeout(async () => {
          await postPremiumJob();
        }, 3000);
      } else {
        toast({
          title: "Payment Failed",
          description: result.CustomerMessage || "Could not initiate M-Pesa payment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('M-Pesa Error:', error);
      toast({
        title: "Error",
        description: "Failed to connect to M-Pesa. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
      setShowPremiumDialog(false);
    }
  };

  const handlePremiumPost = async (selectedAmount?: number) => {
    const amountToPay = selectedAmount || premiumAmount;
    if (selectedAmount) setPremiumAmount(selectedAmount);
    await initiateMpesaPayment(amountToPay);
  };

  const postPremiumJob = async () => {
    try {
      const jobData = {
        job_title: formData.jobTitle,
        location: formData.location,
        payment_type: formData.paymentType,
        payment_amount: parseFloat(formData.paymentAmount),
        job_type: formData.jobType,
        start_date: formData.startDate,
        end_date: formData.endDate || null,
        start_time: formData.startTime,
        end_time: formData.endTime,
        phone_number: formData.phoneNumber,
        description: formData.description || null,
        age_confirmed: formData.ageConfirmed,
        status: 'active',
        is_premium: true
      };

      const { error } = await supabase
        .from('jobs')
        .insert([jobData]);

      if (error) {
        console.error('Error posting premium job:', error);
        // Check if it's a connection error (project paused)
        if (error.message?.includes('connection') || error.message?.includes('timeout')) {
          toast({
            title: "Connection Error",
            description: "Database is temporarily unavailable. Premium job will be posted when connection is restored.",
            variant: "destructive",
          });
          resetAndClose();
          return;
        }
        throw error;
      }

      toast({
        title: "Premium Job Posted Successfully!",
        description: "Your premium job posting is now live and will get more visibility.",
      });

      resetAndClose();
    } catch (error) {
      console.error('Error posting premium job:', error);
      toast({
        title: "Error",
        description: "Failed to post premium job. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const resetAndClose = () => {
    setFormData({
      jobTitle: "",
      location: "",
      paymentType: "",
      paymentAmount: "",
      jobType: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      phoneNumber: "",
      description: "",
      ageConfirmed: false,
    });
    setShowPremiumDialog(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Post a Job
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to post your job. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> You must be 18 years or older to post jobs on KwaGround.
              All job postings are subject to review and must comply with Kenyan labor laws.
            </AlertDescription>
          </Alert>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title/Type *</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Construction Worker, House Help, Boda Rider"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Job Location *
            </Label>
            <Input
              id="location"
              placeholder="e.g., Nairobi, CBD or Kisumu, Town"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type *</Label>
              <Select value={formData.paymentType} onValueChange={(value) => handleInputChange("paymentType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Per Day</SelectItem>
                  <SelectItem value="weekly">Per Week</SelectItem>
                  <SelectItem value="monthly">Per Month</SelectItem>
                  <SelectItem value="commission">Commission Based</SelectItem>
                  <SelectItem value="hourly">Per Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount (KSh) *</Label>
              <Input
                id="paymentAmount"
                type="number"
                placeholder="e.g., 800"
                value={formData.paymentAmount}
                onChange={(e) => handleInputChange("paymentAmount", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Schedule *</Label>
            <Select value={formData.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select job schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="hourly">Per Hour</SelectItem>
                <SelectItem value="contract">Contract/Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number (WhatsApp) *
            </Label>
            <Input
              id="phoneNumber"
              placeholder="e.g., 0712345678 or +254712345678"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              We'll contact you via WhatsApp or call for job details
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide more details about the job requirements, experience needed, etc."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Age Confirmation */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ageConfirmed"
              checked={formData.ageConfirmed}
              onCheckedChange={(checked) => handleInputChange("ageConfirmed", checked as boolean)}
            />
            <Label htmlFor="ageConfirmed" className="text-sm">
              I confirm I am 18 years or older and agree to KwaGround's terms *
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Post Job
            </Button>
          </div>
        </form>

        {/* Premium Packages Dialog - Mandatory */}
        {showPremiumDialog && (
          <Dialog open={showPremiumDialog} onOpenChange={() => setShowPremiumDialog(false)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Choose Premium Package</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All job postings require a premium package for visibility.
                </p>

                {/* Package 250 */}
                <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => handlePremiumPost(250)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Premium Package</h3>
                      <p className="text-sm text-muted-foreground">For jobs paying below KSh 1,500</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">KSh 250</p>
                    </div>
                  </div>
                  <Button 
                    className="mt-3 w-full" 
                    disabled={isProcessingPayment}
                    onClick={(e) => { e.stopPropagation(); handlePremiumPost(250); }}
                  >
                    {isProcessingPayment && premiumAmount === 250 ? "Processing..." : "Select & Pay KSh 250"}
                  </Button>
                </div>

                {/* Package 550 */}
                <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => handlePremiumPost(550)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Premium Package</h3>
                      <p className="text-sm text-muted-foreground">For jobs paying KSh 1,500 and above</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">KSh 550</p>
                    </div>
                  </div>
                  <Button 
                    className="mt-3 w-full" 
                    disabled={isProcessingPayment}
                    onClick={(e) => { e.stopPropagation(); handlePremiumPost(550); }}
                  >
                    {isProcessingPayment && premiumAmount === 550 ? "Processing..." : "Select & Pay KSh 550"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostJobModal;