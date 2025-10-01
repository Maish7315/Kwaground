import { Link } from "react-router-dom";
import { MapPin, Briefcase, Home, Info, Mail, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-foreground">KwaGround</span>
            </div>
            <p className="text-muted-foreground">
              Your hustle starts here. Track fares, find jobs, connect with opportunities across Kenya.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/fares" className="block text-muted-foreground hover:text-primary transition-colors">
                Fares
              </Link>
              <Link to="/jobs" className="block text-muted-foreground hover:text-primary transition-colors">
                Jobs
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Fare Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>Job Listings</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <p className="text-muted-foreground"><strong>Email:</strong> KwaGround.ke@gmail.com</p>
                <p className="text-muted-foreground"><strong>Support:</strong> supportKwaGround.ke@gmail.com</p>
                <p className="text-muted-foreground"><strong>Founder:</strong> Roy-Tecxprosanga.netlify.app</p>
                <p className="text-muted-foreground"><strong>Phone:</strong> +254740297140</p>
                <p className="text-muted-foreground"><strong>Location:</strong> Nairobi, Kenya | Narok, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 KwaGround. All rights reserved. Built for Kenyan youth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;