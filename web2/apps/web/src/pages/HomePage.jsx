
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, Battery, Home, ArrowRight } from 'lucide-react';
import StatCard from '@/components/StatCard.jsx';
import FeatureCard from '@/components/FeatureCard.jsx';
import AgentCard from '@/components/AgentCard.jsx';
import ReviewCard from '@/components/ReviewCard.jsx';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>TrueNorth Solar | Clean Energy for Canadian Homes</title>
        <meta name="description" content="Switch to solar energy with TrueNorth Solar. Reduce your electricity bills and increase energy independence across AB, BC, MB, and SK." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/flagged/photo-1566838616811-559be2de7f3e" 
            alt="Solar panels at sunset"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
        </div>
        
        <div className="container-custom relative z-10 py-24">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-balance leading-tight"
            >
              Clean Energy. <span className="text-primary">Done Right.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-background/80 mb-10 leading-relaxed max-w-2xl"
            >
              Power your Canadian home with premium solar solutions. Cut your electricity bills, increase energy independence, and join thousands making the switch.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-[0.98] text-lg px-8 h-14 rounded-xl"
              >
                <Link to="/get-quote" className="flex items-center gap-2">
                  Get a Free Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-muted border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
            <StatCard number="51 MW" label="Installed Capacity" icon={Zap} delay={0.1} />
            <StatCard number="$285M" label="Customer Savings" icon={TrendingDown} delay={0.2} />
            <StatCard number="628K" label="Tons Carbon Offset" icon={Battery} delay={0.3} />
          </div>
        </div>
      </section>

      {/* Why Solar Section (Bento Grid) */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Solar?</h2>
            <p className="text-xl text-muted-foreground">
              Solar energy is more than just a smart financial decision — it's an investment in your home's future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={TrendingDown}
              title="Slash Your Bills"
              description="Reduce your electricity costs by up to 70% with solar energy. Lock in predictable energy rates for decades and protect yourself from rising utility costs."
              className="md:col-span-2 bg-primary/5 border-primary/20"
              delay={0.1}
            />
            <FeatureCard
              icon={Battery}
              title="Energy Independence"
              description="Generate your own clean power and reduce reliance on the grid. Add battery storage for complete energy security during outages."
              delay={0.2}
            />
            <FeatureCard
              icon={Home}
              title="Boost Home Value"
              description="Solar installations increase property value by an average of 4.1% and make homes sell faster on the real estate market."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* How Our AI Works Section */}
      <section className="py-24 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How Our AI Works</h2>
            <p className="text-xl text-muted-foreground">
              Get instant support from our specialized AI agents, available 24/7 in our community Discord.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AgentCard
              emoji="📚"
              name="Doc Agent"
              description="Get instant answers to technical questions about solar panels, installation, and maintenance."
              delay={0.1}
            />
            <AgentCard
              emoji="🛠️"
              name="Support Agent"
              description="Troubleshoot issues, schedule service, and get help with your existing solar system."
              delay={0.2}
            />
            <AgentCard
              emoji="💼"
              name="Sales Agent"
              description="Explore pricing, financing options, and get personalized quotes for your home."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Customer Reviews Section (Masonry-style) */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied homeowners across Canada who have made the switch to solar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <ReviewCard
                quote="TrueNorth Solar made the entire process seamless. From consultation to installation, everything was transparent and professional."
                author="Sarah M."
                location="Alberta"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:mt-8">
              <ReviewCard
                quote="Finally, a solar company that doesn't pressure you. They answered all my questions and the savings are real."
                author="James T."
                location="British Columbia"
                className="bg-primary/5"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <ReviewCard
                quote="Best investment we've made for our home. The AI support team is incredibly helpful whenever we have questions."
                author="Maria L."
                location="Manitoba"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-foreground text-background text-center">
        <div className="container-custom max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to go solar?</h2>
          <p className="text-xl text-background/80 mb-10">
            Get a free, no-obligation quote and discover how much you can save with solar energy.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-[0.98] text-lg px-10 h-14 rounded-xl"
          >
            <Link to="/get-quote">Get a Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
