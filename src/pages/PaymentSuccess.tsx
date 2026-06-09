import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handlePayPalReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        toast({
          title: "Invalid Request",
          description: "No payment token found.",
          variant: "destructive",
        });
        return;
      }

      const pendingJobData = localStorage.getItem('pendingJobData');
      const pendingApplicationData = localStorage.getItem('pendingApplicationData');

      if (!pendingJobData && !pendingApplicationData) {
        setStatus('error');
        toast({
          title: "Session Expired",
          description: "Data not found. Please start over.",
          variant: "destructive",
        });
        return;
      }

      try {
        const captureResponse = await fetch('/.netlify/functions/paypal-capture-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderID: token })
        });

        const captureResult = await captureResponse.json();

        if (captureResult.success) {
          if (pendingJobData) {
            const jobData = JSON.parse(pendingJobData);
            
            const jobPayload = {
              job_title: jobData.jobTitle,
              location: jobData.location,
              payment_type: jobData.paymentType,
              payment_amount: parseFloat(jobData.paymentAmount),
              job_type: jobData.jobType,
              start_date: jobData.startDate,
              end_date: jobData.endDate || null,
              start_time: jobData.startTime,
              end_time: jobData.endTime,
              phone_number: jobData.phoneNumber,
              description: jobData.description || null,
              age_confirmed: jobData.ageConfirmed,
              status: 'active',
              is_premium: true
            };

            const { error } = await supabase
              .from('jobs')
              .insert([jobPayload]);

            if (error) throw error;
            localStorage.removeItem('pendingJobData');
            
            toast({
              title: "Premium Job Posted Successfully!",
              description: "Your premium job posting is now live and will get more visibility.",
            });

            setTimeout(() => navigate('/jobs'), 2000);
          } else if (pendingApplicationData) {
            const appData = JSON.parse(pendingApplicationData);
            
const applicationPayload = {
               job_title: appData.jobDetails?.title || '',
               job_location: appData.jobDetails?.location || null,
               job_pay: appData.jobDetails?.pay || null,
               job_type: appData.jobDetails?.type || null,
               full_name: appData.fullName,
               email: appData.email,
               age: appData.age,
               gender: appData.gender,
               education_level: appData.educationLevel,
               location: appData.location,
               phone_number: appData.phoneNumber,
               parent_guardian_name: appData.parentGuardianName,
               brother_sister_name: appData.brotherSisterName,
               has_id: appData.hasId,
               id_number: appData.idNumber || null,
               id_card_url: appData.idCard || null,
               has_birth_certificate: appData.hasBirthCertificate || false,
               birth_certificate_url: appData.birthCertificate || null,
               is_kenyan: appData.isKenyan,
               country: appData.isKenyan ? null : appData.country,
               policy_agreed: appData.policyAgreed,
               faithful_honest: appData.faithfulHonest,
               status: 'confirmed'
             };

            const { error } = await supabase
              .from('job_applications')
              .insert([applicationPayload]);

            if (error) throw error;
            localStorage.removeItem('pendingApplicationData');
            
            toast({
              title: "Application Confirmed!",
              description: "Payment of KSh 25 received. Your job application has been approved.",
            });

            setTimeout(() => navigate('/'), 2000);
          }
          setStatus('success');
        } else {
          setStatus('error');
          toast({
            title: "Payment Not Completed",
            description: "Your payment was not completed. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        toast({
          title: "Error",
          description: "Failed to process payment. Please contact support.",
          variant: "destructive",
        });
      }
    };

    handlePayPalReturn();
  }, [navigate, toast]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Processing Payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
          <h2 className="text-xl font-semibold">Payment Successful!</h2>
          <p className="text-muted-foreground">Your job has been posted. Redirecting to jobs page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <XCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-xl font-semibold">Payment Failed</h2>
        <p className="text-muted-foreground">There was an issue processing your payment.</p>
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

export default PaymentSuccess;