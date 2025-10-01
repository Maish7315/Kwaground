import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Target, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About KwaGround
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering Kenyan youth, one route and one job at a time.
            </p>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground leading-relaxed mb-6">
              KwaGround is more than just a platform—it's a movement. Born from the streets of Kenya, 
              we understand the daily struggles of finding affordable transport and reliable job opportunities.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              We're here to change the game. By harnessing the power of community-driven data and 
              cutting-edge technology, KwaGround brings transparency to transport fares and connects 
              job seekers with opportunities across Kenya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Our Mission</h3>
              <p className="text-muted-foreground text-sm">
                To make transport affordable and jobs accessible for every Kenyan youth.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Community First</h3>
              <p className="text-muted-foreground text-sm">
                Built by the community, for the community. Your input shapes our platform.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Real-Time Data</h3>
              <p className="text-muted-foreground text-sm">
                Always accurate, always current. Get the info you need, when you need it.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-hero p-8 rounded-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join the Movement
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Together, we're building a platform that works for everyone. Share fares, post jobs, 
              and help your fellow Kenyans hustle smarter.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
