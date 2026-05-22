
import React from 'react';
import { Helmet } from 'react-helmet';
import AgentCard from '@/components/AgentCard.jsx';

export default function AIAgentsPage() {
  const agents = [
    {
      emoji: '📚',
      name: 'Solar Doc',
      description: 'Get instant answers to technical questions about solar panels, installation, maintenance, and system performance.',
      discordLink: '#',
    },
    {
      emoji: '🛠️',
      name: 'Solar Support',
      description: 'Troubleshoot issues with your existing solar system, schedule service appointments, and get help with monitoring tools.',
      discordLink: '#',
    },
    {
      emoji: '💼',
      name: 'Solar Sales',
      description: 'Explore pricing options, compare financing plans, and get personalized quotes for your home based on your specific situation.',
      discordLink: '#',
    },
  ];

  return (
    <>
      <Helmet>
        <title>AI Agents | TrueNorth Solar</title>
        <meta name="description" content="Get instant help from TrueNorth Solar's AI agents. Available 24/7 in our Discord community." />
      </Helmet>

      <section className="py-24 bg-muted">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Meet Our AI Agents</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Our AI agents are available 24/7 in our community Discord. Get the support you need, when you need it, without waiting for business hours.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-lg transition-colors"
          >
            Join Our Discord Server
          </a>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {agents.map((agent, index) => (
              <AgentCard
                key={index}
                emoji={agent.emoji}
                name={agent.name}
                description={agent.description}
                discordLink={agent.discordLink}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
