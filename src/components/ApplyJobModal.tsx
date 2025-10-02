import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, User, Phone, MapPin, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDetails: {
    title: string;
    location: string;
    pay: string;
    type: string;
  } | null;
}

const ApplyJobModal = ({ isOpen, onClose, jobDetails }: ApplyJobModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    educationLevel: "",
    location: "",
    phoneNumber: "",
    parentGuardianName: "",
    brotherSisterName: "",
    policyAgreed: false,
    faithfulHonest: false,
    idNumber: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        age: "",
        gender: "",
        educationLevel: "",
        location: "",
        phoneNumber: "",
        parentGuardianName: "",
        brotherSisterName: "",
        policyAgreed: false,
        faithfulHonest: false,
        idNumber: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePhoneNumber = (number: string): boolean => {
    // Accept only numbers starting with 07 or +2547
    const phoneRegex = /^(\+2547|07)\d{8}$/;
    return phoneRegex.test(number.replace(/\s+/g, ''));
  };

  const validateNames = (name: string): boolean => {
    // Check if name contains at least two words (separated by space)
    const nameParts = name.trim().split(/\s+/);
    return nameParts.length >= 2 && nameParts.every(part => part.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.age || !formData.gender || !formData.educationLevel || !formData.location ||
        !formData.phoneNumber || !formData.parentGuardianName || !formData.brotherSisterName ||
        !formData.idNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Age validation - must be 18 or above
    if (parseInt(formData.age) < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be 18 years or older to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    // Phone number validation - only accept 07 or +2547 prefixes
    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Only phone numbers starting with 07 or +2547 are accepted.",
        variant: "destructive",
      });
      return;
    }

    // Parent/Guardian name validation - must have at least two names
    if (!validateNames(formData.parentGuardianName)) {
      toast({
        title: "Invalid Parent/Guardian Name",
        description: "Please provide the full name (at least two names) of your parent or guardian.",
        variant: "destructive",
      });
      return;
    }

    // Brother/Sister name validation - must have at least two names (unless N/A)
    if (formData.brotherSisterName.toLowerCase() !== 'n/a' && !validateNames(formData.brotherSisterName)) {
      toast({
        title: "Invalid Brother/Sister Name",
        description: "Please provide the full name (at least two names) of your brother/sister, or enter 'N/A' if none.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.policyAgreed || !formData.faithfulHonest) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the policies and confirm your faithfulness and honesty.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Job application data:", { ...formData, jobDetails });

    toast({
      title: "Application Confirmed!",
      description: "Document application confirmed. Wait for approval within 72 hours.",
    });

    // Reset form and close modal
    setFormData({
      age: "",
      gender: "",
      educationLevel: "",
      location: "",
      phoneNumber: "",
      parentGuardianName: "",
      brotherSisterName: "",
      policyAgreed: false,
      faithfulHonest: false,
      idNumber: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Apply for: {jobDetails?.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important Warning:</strong> Kindly fill in your correct details. Once you miss input your details and give a fraud name, you will lose a chance to get the job you have chosen.
            </AlertDescription>
          </Alert>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 25"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="educationLevel" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Education Level *
              </Label>
              <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange("educationLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="certificate">Certificate/Diploma</SelectItem>
                  <SelectItem value="degree">Degree</SelectItem>
                  <SelectItem value="masters">Masters</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="none">No Formal Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Current Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g., Nairobi, Westlands"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              placeholder="e.g., 0712345678 or +254712345678"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Only numbers starting with 07 or +2547 are accepted.
            </p>
          </div>

          {/* Family Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentGuardianName">Parent/Guardian Full Name *</Label>
              <Input
                id="parentGuardianName"
                placeholder="Full name of parent or guardian"
                value={formData.parentGuardianName}
                onChange={(e) => handleInputChange("parentGuardianName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brotherSisterName">Brother/Sister Name *</Label>
              <Input
                id="brotherSisterName"
                placeholder="Full name or N/A if none"
                value={formData.brotherSisterName}
                onChange={(e) => handleInputChange("brotherSisterName", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Put N/A if you have no siblings
              </p>
            </div>
          </div>

          {/* ID Information */}
          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number *</Label>
            <Input
              id="idNumber"
              placeholder="Your Kenyan ID number"
              value={formData.idNumber}
              onChange={(e) => handleInputChange("idNumber", e.target.value)}
              required
            />
          </div>


          {/* Agreements */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="policyAgreed"
                checked={formData.policyAgreed}
                onCheckedChange={(checked) => handleInputChange("policyAgreed", checked as boolean)}
              />
              <Label htmlFor="policyAgreed" className="text-sm">
                I agree to KwaGround's terms and policies *
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="faithfulHonest"
                checked={formData.faithfulHonest}
                onCheckedChange={(checked) => handleInputChange("faithfulHonest", checked as boolean)}
              />
              <Label htmlFor="faithfulHonest" className="text-sm">
                I confirm I am faithful and honest in providing my information *
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;