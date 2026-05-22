
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle, Phone, FileText } from 'lucide-react';

export default function GetAQuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Quote request received. We'll be in touch shortly.");
      setIsSubmitting(false);
      e.target.reset();
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Get a Free Quote | TrueNorth Solar</title>
        <meta name="description" content="Request a free solar quote for your Canadian home." />
      </Helmet>

      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 py-20 px-6 lg:px-20 bg-background flex flex-col justify-center">
          <div className="max-w-xl w-full mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get a Free Quote</h1>
            <p className="text-lg text-muted-foreground mb-10">
              Tell us about your home and energy needs. We'll create a custom solar solution with transparent pricing.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required placeholder="Maya Chen" className="h-12 text-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required placeholder="(555) 123-4567" className="h-12 text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required placeholder="maya@example.com" className="h-12 text-foreground" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Select required>
                    <SelectTrigger className="h-12 text-foreground">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AB">Alberta</SelectItem>
                      <SelectItem value="BC">British Columbia</SelectItem>
                      <SelectItem value="MB">Manitoba</SelectItem>
                      <SelectItem value="SK">Saskatchewan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bill">Monthly Bill ($)</Label>
                  <Input id="bill" type="number" required placeholder="150" className="h-12 text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Details</Label>
                <Textarea id="message" placeholder="Tell us about your roof, energy goals, etc." className="min-h-[120px] text-foreground" />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? 'Submitting...' : 'Request My Quote'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side - Info & Image */}
        <div className="flex-1 bg-muted relative hidden lg:flex flex-col">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1692578919818-8418a9390759" 
              alt="Modern home with solar panels"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative z-10 p-20 flex flex-col justify-center h-full">
            <div className="bg-background/90 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-lg">
              <h2 className="text-3xl font-bold mb-8">What Happens Next?</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl h-fit">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">We review your info</h3>
                    <p className="text-muted-foreground">Our team analyzes your energy needs and property details.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl h-fit">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Our advisor calls you</h3>
                    <p className="text-muted-foreground">A solar expert reaches out to discuss your goals and answer questions.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl h-fit">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Free design presented</h3>
                    <p className="text-muted-foreground">Receive a detailed system design with pricing and savings projections.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
