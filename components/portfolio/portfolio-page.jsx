'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { caseStudies, clients, navLinks, outputStack, processSteps, proofStats, services, testimonials } from './data';

function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const stored = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    root.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !dark;
    setDark(next);
    root.classList.toggle('dark', next);
    window.localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="loading-screen"
    >
      <div className="loader-ring" />
      <p>Loading premium experience…</p>
    </motion.div>
  );
}

function CursorGlow() {
  useEffect(() => {
    const el = document.getElementById('cursor-glow');
    if (!el) return;

    const move = (event) => {
      el.style.transform = `translate(${event.clientX - 90}px, ${event.clientY - 90}px)`;
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <div id="cursor-glow" className="cursor-glow" aria-hidden="true" />;
}

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl mx-auto mb-10 text-center md:mb-14">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}

export function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1100);
    return () => clearTimeout(timeout);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <CursorGlow />

      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl bg-[var(--surface)]/80">
        <div className="container-main nav-shell">
          <Link href="#" className="brand-mark">
            AICM Studio
          </Link>
          <nav className="items-center hidden gap-6 md:flex">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="#cta" className="btn-primary">
              Book a Call
            </a>
          </div>
        </div>
      </header>

      <main className="container-main">
        <section className="hero-grid section-space" id="top">
          <div>
            <Reveal>
              <p className="section-eyebrow">AI Content Marketer & Video Editor</p>
              <h1 className="hero-title">I build founder-led content systems that turn attention into high-ticket revenue.</h1>
              <p className="hero-subtitle">
                For CXOs, founders, and personal brands who want authority, audience growth, and qualified inbound leads—without
                content chaos.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <a href="#cta" className="btn-primary">
                  Book a Call
                </a>
                <a href="#case-studies" className="btn-secondary">
                  View Work
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <div className="glass-panel hero-stat-card">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Growth Snapshot</p>
              <h3>Built for high-ticket client acquisition.</h3>
              <ul className="space-y-3">
                {proofStats.slice(0, 3).map((stat) => (
                  <li key={stat.label} className="flex items-center justify-between gap-6 pb-2 border-b border-white/10">
                    <span className="text-[var(--muted)]">{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section className="section-space-sm">
          <div className="proof-bar glass-panel">
            <div className="flex flex-wrap gap-5 md:gap-8">
              {clients.map((client) => (
                <span key={client} className="proof-client">
                  {client}
                </span>
              ))}
            </div>
            <div className="proof-metrics">
              {proofStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section-space">
          <SectionHeading
            eyebrow="About"
            title="Your unfair advantage: strategy-grade thinking + performance-grade editing."
            description="I combine AI-powered content intelligence, conversion psychology, and cinematic editing to build authority ecosystems for leaders who sell premium offers."
          />
          <Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              <article className="glass-panel">
                <h3>Not just content. Revenue architecture.</h3>
                <p>
                  Most teams optimize for views. I optimize for qualified conversations, pipeline velocity, and positioning power. Every asset maps to a business objective.
                </p>
              </article>
              <article className="glass-panel">
                <h3>AI-assisted. Human-led.</h3>
                <p>
                  AI accelerates research, ideation, and iteration. Human creative direction ensures premium storytelling, brand trust, and market differentiation.
                </p>
              </article>
            </div>
          </Reveal>
        </section>

        <section id="services" className="section-space">
          <SectionHeading
            eyebrow="Services"
            title="Done-for-you growth systems for premium personal brands."
            description="Engagement is vanity. Strategic visibility that drives inbound demand is the standard."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 0.08}>
                <article className="glass-panel card-hover h-full">
                  <h3>{service.title}</h3>
                  <p>{service.outcome}</p>
                  <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                    {service.bullets.map((bullet) => (
                      <li key={bullet}>• {bullet}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="case-studies" className="section-space">
          <SectionHeading
            eyebrow="Case Studies"
            title="Proof over promises."
            description="A sample of campaigns engineered to generate authority, audience growth, and revenue outcomes."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {caseStudies.map((study, index) => (
              <Reveal key={study.title} delay={index * 0.06}>
                <article className="overflow-hidden glass-panel card-hover h-full">
                  <div className="overflow-hidden rounded-xl border border-white/10 aspect-video mb-4">
                    <iframe
                      src={study.videoUrl}
                      title={study.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <p className="section-eyebrow">{study.niche}</p>
                  <h3 className="mb-2">{study.title}</h3>
                  <p><strong>Problem:</strong> {study.problem}</p>
                  <p><strong>Strategy:</strong> {study.strategy}</p>
                  <p><strong>Execution:</strong> {study.execution}</p>
                  <p><strong>Results:</strong> {study.results}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="process" className="section-space">
          <SectionHeading
            eyebrow="Process"
            title="A clear system that scales with your ambition."
            description="You get a strategic partner with an operator mindset, not a freelancer guessing each week."
          />
          <div className="grid gap-4 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05}>
                <article className="h-full glass-panel card-hover">
                  <p className="inline-flex items-center justify-center w-8 h-8 mb-3 text-sm font-semibold rounded-full bg-white/10">
                    {index + 1}
                  </p>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="outputs" className="section-space">
          <SectionHeading
            eyebrow="Outputs"
            title="What you get every month is concrete, visible, and measurable."
            description="A premium execution layer that ships content assets tied to revenue outcomes—not random posting."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {outputStack.map((stack, index) => (
              <Reveal key={stack.label} delay={index * 0.06}>
                <article className="glass-panel card-hover h-full">
                  <h3>{stack.label}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                    {stack.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="testimonials" className="section-space">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by ambitious leaders who value quality and outcomes."
            description="Social proof from founders and operators who invested in premium content execution."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <article className="glass-panel card-hover">
                  <div className="mb-4 overflow-hidden rounded-xl border border-white/10 aspect-video">
                    <iframe
                      src={testimonial.videoUrl}
                      title={testimonial.name}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <p className="mt-4 font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
                  <p className="mt-2 text-sm">{testimonial.metric}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="cta" className="section-space">
          <Reveal>
            <div className="text-center glass-panel cta-panel">
              <p className="section-eyebrow">Ready to Scale?</p>
              <h2 className="section-title">Let’s scale your content into a predictable lead engine.</h2>
              <p className="max-w-2xl mx-auto section-description">
                If you want strategic content that builds authority and closes premium deals, let’s design your growth system.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-7">
                <a className="btn-primary" href="mailto:hello@aicmstudio.com">
                  Book Call
                </a>
                <a className="btn-secondary" href="https://cal.com" target="_blank" rel="noreferrer">
                  View Availability
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <a href="#cta" className="floating-cta">
        Book a Call
      </a>

      <footer className="container-main footer-shell">
        <p>© {year} AICM Studio</p>
        <div className="flex flex-wrap gap-4">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href="mailto:hello@aicmstudio.com">hello@aicmstudio.com</a>
        </div>
      </footer>
    </>
  );
}
