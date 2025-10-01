import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We're here to help. Reach out anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              
              <div className="space-y-4 mb-8">
                <Card className="p-4 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href="mailto:KwaGround.ke@gmail.com" className="font-semibold text-foreground hover:text-primary transition-colors">
                        KwaGround.ke@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <a href="tel:+254740297140" className="font-semibold text-foreground hover:text-primary transition-colors">
                        +254740297140
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">Nairobi, Kenya | Narok, Kenya</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-bold text-foreground mb-2">Office Hours</h3>
                <p className="text-muted-foreground text-sm">Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground text-sm">Saturday: 9:00 AM - 2:00 PM</p>
                <p className="text-muted-foreground text-sm">Sunday: Closed</p>
              </div>
            </div>

            <div>
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground block mb-2">
                      Your Name
                    </label>
                    <Input id="name" name="name" required placeholder="Roy Sanga" />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground block mb-2">
                      Email Address
                    </label>
                    <Input id="email" name="email" type="email" required placeholder="KwaGround@example.com" />
                  </div>

                  <div>
                    <label htmlFor="subject" className="text-sm font-medium text-foreground block mb-2">
                      Subject
                    </label>
                    <Input id="subject" name="subject" required placeholder="How can KwaGround help you?" />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground block mb-2">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      required 
                      placeholder="Tell us more..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
