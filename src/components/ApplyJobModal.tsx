import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertTriangle, User, Phone, MapPin, GraduationCap, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
    fullName: "",
    age: "",
    gender: "",
    educationLevel: "",
    location: "",
    phoneNumber: "",
    parentGuardianName: "",
    brotherSisterName: "",
    hasId: true,
    idNumber: "",
    idCard: null as File | null,
    hasBirthCertificate: false,
    birthCertificate: null as File | null,
    isKenyan: true,
    country: "",
    policyAgreed: false,
    faithfulHonest: false,
  });

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or image file for birth certificate.",
        variant: "destructive",
      });
      return;
    }
    handleInputChange("birthCertificate", file);
  };

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or image file for ID card.",
        variant: "destructive",
      });
      return;
    }
    handleInputChange("idCard", file);
  };

  const validateKenyanSafaricomNumber = (number: string): boolean => {
    // Kenyan phone numbers: 07 or 01 followed by 8 digits
    const kenyanRegex = /^(\+254|0)(7|1)\d{8}$/;
    return kenyanRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - ID is mandatory if hasId is true, otherwise birth certificate is mandatory
    if (!formData.fullName || !formData.age || !formData.gender || !formData.educationLevel || 
        !formData.location || !formData.phoneNumber || !formData.parentGuardianName || 
        !formData.brotherSisterName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check ID/Birth certificate requirement
    if (formData.hasId) {
      if (!formData.idNumber || !formData.idCard) {
        toast({
          title: "ID Required",
          description: "Please enter your ID number and upload your ID card.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // If no ID, birth certificate is mandatory
      if (!formData.birthCertificate) {
        toast({
          title: "Birth Certificate Required",
          description: "Since you don't have an ID, please upload your birth certificate.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate country for non-Kenyans
    if (!formData.isKenyan && !formData.country) {
      toast({
        title: "Country Required",
        description: "Please select your country.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(formData.age) < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be 18 years or older to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    if (!validateKenyanSafaricomNumber(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan Safaricom phone number.",
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

    try {
      let idCardData: string | null = null;
      let birthCertificateData: string | null = null;

      // Convert ID card file to base64
      if (formData.idCard) {
        const reader = new FileReader();
        idCardData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.idCard);
        }) as string;
      }

      // Convert birth certificate file to base64
      if (formData.birthCertificate) {
        const reader = new FileReader();
        birthCertificateData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.birthCertificate);
        }) as string;
      }

      // Prepare application data
      const applicationData = {
        job_title: jobDetails?.title || '',
        job_location: jobDetails?.location || null,
        job_pay: jobDetails?.pay || null,
        job_type: jobDetails?.type || null,
        full_name: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        education_level: formData.educationLevel,
        location: formData.location,
        phone_number: formData.phoneNumber,
        parent_guardian_name: formData.parentGuardianName,
        brother_sister_name: formData.brotherSisterName,
        has_id: formData.hasId,
        id_number: formData.hasId ? formData.idNumber : null,
        id_card_url: idCardData,
        has_birth_certificate: formData.hasBirthCertificate,
        birth_certificate_url: birthCertificateData,
        is_kenyan: formData.isKenyan,
        country: formData.isKenyan ? null : formData.country,
        policy_agreed: formData.policyAgreed,
        faithful_honest: formData.faithfulHonest,
        status: 'pending'
      };

      // Save to Supabase
      const { error } = await supabase
        .from('job_applications')
        .insert([applicationData]);

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: "Submission Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Application Submitted!",
        description: "Your job application has been submitted successfully. We'll contact you soon.",
      });

      // Reset form and close modal
      setFormData({
        fullName: "",
        age: "",
        gender: "",
        educationLevel: "",
        location: "",
        phoneNumber: "",
        parentGuardianName: "",
        brotherSisterName: "",
        hasId: true,
        idNumber: "",
        idCard: null,
        hasBirthCertificate: false,
        birthCertificate: null,
        isKenyan: true,
        country: "",
        policyAgreed: false,
        faithfulHonest: false,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>

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
              Phone Number (Safaricom Only) *
            </Label>
            <Input
              id="phoneNumber"
              placeholder="e.g., 0712345678 or +254712345678"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Only Kenyan Safaricom numbers are accepted for contact purposes.
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

          {/* Citizenship */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Citizenship *
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isKenyan"
                  checked={formData.isKenyan}
                  onCheckedChange={(checked) => handleInputChange("isKenyan", checked as boolean)}
                />
                <Label htmlFor="isKenyan" className="text-sm">
                  I am a Kenyan citizen
                </Label>
              </div>
            </div>
            {!formData.isKenyan && (
              <div className="space-y-2">
                <Label htmlFor="country">Select Your African Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uganda">Uganda</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="rwanda">Rwanda</SelectItem>
                    <SelectItem value="burundi">Burundi</SelectItem>
                    <SelectItem value="south_sudan">South Sudan</SelectItem>
                    <SelectItem value="ethiopia">Ethiopia</SelectItem>
                    <SelectItem value="sudan">Sudan</SelectItem>
                    <SelectItem value="somalia">Somalia</SelectItem>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="south_africa">South Africa</SelectItem>
                    <SelectItem value="egypt">Egypt</SelectItem>
                    <SelectItem value="morocco">Morocco</SelectItem>
                    <SelectItem value="algeria">Algeria</SelectItem>
                    <SelectItem value="tunisia">Tunisia</SelectItem>
                    <SelectItem value="libya">Libya</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="other">Other African Country</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* ID and Birth Certificate */}
          <div className="space-y-4">
            <Label>Identification Documents *</Label>
            
            {/* Has ID Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasId"
                checked={formData.hasId}
                onCheckedChange={(checked) => handleInputChange("hasId", checked as boolean)}
              />
              <Label htmlFor="hasId" className="text-sm">
                I have a National ID
              </Label>
            </div>

            {/* ID Upload - shown if hasId is true */}
            {formData.hasId && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="idNumber">National ID Number *</Label>
                <Input
                  id="idNumber"
                  placeholder="Your National ID number"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  required={formData.hasId}
                />
                <Label htmlFor="idCard" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload National ID *
                </Label>
                <Input
                  id="idCard"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleIdFileChange}
                  required={formData.hasId}
                />
              </div>
            )}

            {/* Birth Certificate Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasBirthCertificate"
                checked={formData.hasBirthCertificate}
                onCheckedChange={(checked) => handleInputChange("hasBirthCertificate", checked as boolean)}
              />
              <Label htmlFor="hasBirthCertificate" className="text-sm">
                I also have a Birth Certificate (optional)
              </Label>
            </div>

            {formData.hasBirthCertificate && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="birthCertificate" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Birth Certificate
                </Label>
                <Input
                  id="birthCertificate"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {!formData.hasId && !formData.hasBirthCertificate && (
              <p className="text-sm text-red-500">
                Please provide either National ID or Birth Certificate
              </p>
            )}
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