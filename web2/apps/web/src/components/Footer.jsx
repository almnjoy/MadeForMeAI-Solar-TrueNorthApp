
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/truenorth-logo.svg" alt="TrueNorth Solar" className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed">
              Leading the way in sustainable energy solutions for homes and businesses across the nation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-white transition-colors duration-200">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/ai-agents" className="text-sm hover:text-white transition-colors duration-200">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link to="/get-quote" className="text-sm hover:text-white transition-colors duration-200">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm">Residential Solar</span>
              </li>
              <li>
                <span className="text-sm">Commercial Solutions</span>
              </li>
              <li>
                <span className="text-sm">Solar Maintenance</span>
              </li>
              <li>
                <span className="text-sm">Energy Consulting</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">info@truenorthsolar.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">(555) 847-2930</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">1247 Solar Drive, Austin, TX 78701</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © 2026 TrueNorth Solar. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
