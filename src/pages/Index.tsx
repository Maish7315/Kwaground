import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Briefcase, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import heroTransport from "@/assets/hero-transport.jpg";
import heroJobs from "@/assets/hero-jobs.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your Hustle Starts Here
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Track real-time matatu & boda fares. Find daily jobs across Kenya. 
                Built for the streets, trusted by thousands.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/fares">
                  <Button size="lg" className="gap-2 text-lg px-8">
                    <MapPin className="w-5 h-5" />
                    Check Fares
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                    <Briefcase className="w-5 h-5" />
                    Find Jobs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroTransport} 
                alt="Kenyan matatus and urban transport"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why KwaGround?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're not just another app. We're your daily companion for saving money and finding opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Real-Time Fares</h3>
              <p className="text-muted-foreground">
                Know exactly how much you'll pay before you board. No more surprises, no more debates.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Daily Job Listings</h3>
              <p className="text-muted-foreground">
                From boda rides to mjengo, find casual work opportunities across Kenya every single day.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Community Driven</h3>
              <p className="text-muted-foreground">
                Built by Kenyans, for Kenyans. Your reports and posts help everyone in the community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <img 
                src={heroTransport} 
                alt="Track fares"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
              />
              <div className="relative p-8">
                <MapPin className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Track Fares</h3>
                <p className="text-muted-foreground mb-6">
                  Get accurate fare info for matatus and bodas across Nairobi, Kisumu, Mombasa, and more.
                </p>
                <Link to="/fares">
                  <Button className="gap-2">
                    View Fares
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <img 
                src={heroJobs} 
                alt="Find jobs"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
              />
              <div className="relative p-8">
                <Briefcase className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-3">Find Jobs</h3>
                <p className="text-muted-foreground mb-6">
                  Browse daily opportunities in construction, transport, farming, security, and more.
                </p>
                <Link to="/jobs">
                  <Button className="gap-2">
                    Browse Jobs
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-white/90">Routes Tracked</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2K+</div>
              <div className="text-white/90">Jobs Posted</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-white/90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">7</div>
              <div className="text-white/90">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Zap className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Join KwaGround?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyan youth who are saving on transport and finding daily opportunities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/fares">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
