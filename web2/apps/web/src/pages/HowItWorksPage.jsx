
import React from 'react';
import { Helmet } from 'react-helmet';
import { MessageSquare, Ruler, FileCheck, FileText, Wrench, Zap } from 'lucide-react';
import StepCard from '@/components/StepCard.jsx';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Free Consultation',
      description: 'Schedule a call with our solar experts to discuss your energy needs, goals, and property details. We answer all your questions with zero pressure.',
    },
    {
      number: '02',
      icon: Ruler,
      title: 'System Design',
      description: 'Our engineering team creates a custom solar system design optimized for your roof, energy usage, and budget using advanced modeling software.',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'Site Survey',
      description: 'A certified technician visits your property to verify measurements, assess roof condition, and confirm electrical compatibility.',
    },
    {
      number: '04',
      icon: FileText,
      title: 'Permits & Approvals',
      description: 'We handle all the paperwork. Our team secures the necessary permits and utility approvals so you don\'t have to lift a finger.',
    },
    {
      number: '05',
      icon: Wrench,
      title: 'Professional Install',
      description: 'Our certified installers complete your system in 1-3 days. We ensure quality workmanship and minimal disruption to your home.',
    },
    {
      number: '06',
      icon: Zap,
      title: 'System Activation',
      description: 'Once inspected and approved, we activate your system and set up remote monitoring so you can track your clean energy production.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>How It Works | TrueNorth Solar</title>
        <meta name="description" content="Learn about TrueNorth Solar's simple 6-step installation process. From free consultation to system activation." />
      </Helmet>

      <section className="py-24 bg-muted">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">How It Works</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Going solar is easier than you think. Our streamlined process takes you from consultation to clean energy in just a few simple steps.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-custom max-w-4xl">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                number={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
