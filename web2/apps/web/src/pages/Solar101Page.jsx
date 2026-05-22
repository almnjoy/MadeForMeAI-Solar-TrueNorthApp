
import React from 'react';
import { Helmet } from 'react-helmet';
import { Sun, Zap, Wrench, BarChart3 } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion.jsx';

export default function Solar101Page() {
  const components = [
    {
      icon: Sun,
      title: 'Solar Panels',
      description: 'Photovoltaic (PV) panels convert sunlight into direct current (DC) electricity. Modern panels are highly efficient and last 25-30 years.',
    },
    {
      icon: Zap,
      title: 'Inverter',
      description: 'Converts DC electricity from panels into alternating current (AC) that powers your home appliances.',
    },
    {
      icon: Wrench,
      title: 'Mounting System',
      description: 'Secure racking attaches panels to your roof. Designed to withstand Canadian wind, snow, and weather.',
    },
    {
      icon: BarChart3,
      title: 'Monitoring',
      description: 'Track your system\'s performance in real-time via app. See energy production, consumption, and savings.',
    },
  ];

  const faqs = [
    {
      question: 'How do solar panels work?',
      answer: 'Solar panels contain photovoltaic cells made of silicon. When sunlight hits these cells, it knocks electrons loose, creating an electric current. This DC electricity flows to an inverter, which converts it to AC electricity that powers your home.',
    },
    {
      question: 'Will solar panels work in Canadian winters?',
      answer: 'Yes. Solar panels actually perform better in cold temperatures. While shorter days mean less sunlight, modern panels are highly efficient and can generate significant power even on cloudy days. Snow typically slides off angled panels.',
    },
    {
      question: 'How much can I save with solar?',
      answer: 'Savings vary based on your electricity rates, system size, and energy usage. Most Canadian homeowners save 40-70% on their electricity bills. A typical system pays for itself in 8-12 years.',
    },
    {
      question: 'What happens during a power outage?',
      answer: 'Standard grid-tied systems shut down during outages for safety reasons (to protect utility workers). If you want backup power, you can add a battery storage system.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Solar 101 | TrueNorth Solar</title>
        <meta name="description" content="Learn how solar panels work, understand key components, and get answers to common questions about solar energy." />
      </Helmet>

      <section className="py-24 bg-muted">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Solar 101</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to know about solar energy, from how panels work to understanding your system's performance.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">System Components</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {components.map((comp, idx) => (
              <div key={idx} className="flex gap-6 p-8 bg-card rounded-2xl border border-border shadow-sm">
                <div className="p-4 bg-primary/10 rounded-xl h-fit">
                  <comp.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{comp.title}</h3>
                  <p className="text-muted-foreground text-lg">{comp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Understanding kW vs kWh</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <h3 className="text-3xl font-bold text-primary mb-4">kW (Kilowatt)</h3>
              <p className="text-lg text-muted-foreground">
                A measure of <strong>power or capacity</strong>. Think of it like the speed of a car. A 7 kW solar system can produce up to 7 kilowatts of power at any given moment under ideal conditions.
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
              <h3 className="text-3xl font-bold text-secondary mb-4">kWh (Kilowatt-hour)</h3>
              <p className="text-lg text-muted-foreground">
                A measure of <strong>energy produced over time</strong>. Think of it like the distance traveled. If your 7 kW system runs at full capacity for 1 hour, it produces 7 kWh of energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </>
  );
}
