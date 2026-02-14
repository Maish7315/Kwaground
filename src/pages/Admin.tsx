import { useState, useEffect } from 'react';
import { supabase, JobApplication, Job } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const Admin = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'jobs'>('applications');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, jobsRes] = await Promise.all([
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false })
      ]);

      if (appsRes.data) setApplications(appsRes.data);
      if (jobsRes.data) setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">KwaGround Admin</h1>
      
      <div className="flex gap-4 mb-6">
        <Button 
          variant={activeTab === 'applications' ? 'default' : 'outline'}
          onClick={() => setActiveTab('applications')}
        >
          Applications ({applications.length})
        </Button>
        <Button 
          variant={activeTab === 'jobs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs ({jobs.length})
        </Button>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{app.job_title}</CardTitle>
                  <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                    {app.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Applied: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Full Name:</strong> {app.full_name}</p>
                    <p><strong>Age:</strong> {app.age}</p>
                    <p><strong>Gender:</strong> {app.gender}</p>
                    <p><strong>Education:</strong> {app.education_level}</p>
                    <p><strong>Location:</strong> {app.location}</p>
                    <p><strong>Phone:</strong> {app.phone_number}</p>
                    <p><strong>Parent/Guardian:</strong> {app.parent_guardian_name}</p>
                    <p><strong>Sibling:</strong> {app.brother_sister_name}</p>
                    <p><strong>Citizenship:</strong> {app.is_kenyan ? 'Kenyan' : app.country}</p>
                  </div>
                  <div>
                    <p><strong>Has National ID:</strong> {app.has_id ? 'Yes' : 'No'}</p>
                    {app.has_id && (
                      <>
                        <p><strong>ID Number:</strong> {app.id_number}</p>
                        {app.id_card_url && (
                          <Button 
                            onClick={() => setSelectedImage(app.id_card_url || null)}
                            className="flex items-center gap-2 mt-2"
                          >
                            <Eye className="w-4 h-4" />
                            View ID Card
                          </Button>
                        )}
                      </>
                    )}
                    <p className="mt-2"><strong>Has Birth Certificate:</strong> {app.has_birth_certificate ? 'Yes' : 'No'}</p>
                    {app.has_birth_certificate && app.birth_certificate_url && (
                      <Button 
                        onClick={() => setSelectedImage(app.birth_certificate_url || null)}
                        className="flex items-center gap-2 mt-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Birth Certificate
                      </Button>
                    )}
                    <p className="mt-2"><strong>Policy Agreed:</strong> {app.policy_agreed ? 'Yes' : 'No'}</p>
                    <p><strong>Faithful & Honest:</strong> {app.faithful_honest ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {applications.length === 0 && (
            <p className="text-center text-muted-foreground">No applications yet</p>
          )}
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{job.job_title}</CardTitle>
                  <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Posted: {new Date(job.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Payment:</strong> KSh {job.payment_amount} / {job.payment_type}</p>
                    <p><strong>Job Type:</strong> {job.job_type}</p>
                  </div>
                  <div>
                    <p><strong>Start Date:</strong> {job.start_date}</p>
                    <p><strong>End Date:</strong> {job.end_date || 'Not specified'}</p>
                    <p><strong>Work Hours:</strong> {job.start_time} - {job.end_time}</p>
                    <p><strong>Phone:</strong> {job.phone_number}</p>
                    {job.description && <p><strong>Description:</strong> {job.description}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {jobs.length === 0 && (
            <p className="text-center text-muted-foreground">No jobs posted yet</p>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img 
              src={selectedImage} 
              alt="Birth Certificate" 
              className="max-w-full h-auto"
            />
            <Button 
              onClick={() => setSelectedImage(null)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
