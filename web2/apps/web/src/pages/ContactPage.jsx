
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent successfully.");
      setIsSubmitting(false);
      e.target.reset();
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | TrueNorth Solar</title>
        <meta name="description" content="Get in touch with TrueNorth Solar. We serve AB, BC, MB, and SK." />
      </Helmet>

      <section className="py-24 bg-muted">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have questions? We're here to help. Reach out to our team and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-custom max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info & Map */}
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                  <Phone className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Phone</h3>
                  <p className="text-muted-foreground">1-800-SOLAR-CA</p>
                  <p className="text-sm text-muted-foreground mt-2">Mon-Fri, 9am-5pm MST</p>
                </div>
                <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                  <Mail className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-muted-foreground">hello@truenorthsolar.ca</p>
                  <p className="text-sm text-muted-foreground mt-2">24/7 Support via AI Agents</p>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Service Areas</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-xl text-center font-semibold">Alberta (AB)</div>
                  <div className="p-4 bg-muted rounded-xl text-center font-semibold">British Columbia (BC)</div>
                  <div className="p-4 bg-muted rounded-xl text-center font-semibold">Manitoba (MB)</div>
                  <div className="p-4 bg-muted rounded-xl text-center font-semibold">Saskatchewan (SK)</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-10 rounded-3xl border border-border shadow-lg">
              <h2 className="text-3xl font-bold mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required placeholder="Your name" className="h-12 text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required placeholder="your@email.com" className="h-12 text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required placeholder="How can we help you?" className="min-h-[150px] text-foreground" />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
