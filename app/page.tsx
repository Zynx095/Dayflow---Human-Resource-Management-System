"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Clock,
  Calendar,
  DollarSign,
  LayoutDashboard,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import Shuffle from "@/components/Shuffle";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const capabilities = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description: "A single view of attendance, leave balance, upcoming holidays, and quick actions — tailored for each role.",
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "One-click check-in and check-out with automatic time calculation and weekly history.",
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Apply for paid, sick, or unpaid leave with date selection, reason tracking, and real-time status updates.",
  },
  {
    icon: DollarSign,
    title: "Payroll & Compensation",
    description: "Transparent salary breakdown with base pay, allowances, deductions, and net salary — all in INR.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "HR teams can view, search, and manage the complete workforce directory with department-level detail.",
  },
  {
    icon: BarChart3,
    title: "HR Analytics",
    description: "Real-time workforce metrics — total headcount, daily attendance, and pending actions at a glance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Sign In",
    description: "Employees and HR managers log in with role-based access that routes them to the right dashboard instantly.",
  },
  {
    number: "02",
    title: "Manage Daily Tasks",
    description: "Check in, apply for leave, view payslips, or approve requests — everything from one unified interface.",
  },
  {
    number: "03",
    title: "Stay Informed",
    description: "Real-time analytics, attendance history, and leave tracking keep your team aligned and productive.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Dayflow Logo" className="h-10 w-auto rounded-md" />
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">Dayflow</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[80vh] flex flex-col items-center justify-center">
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full mb-6 flex items-center justify-center pointer-events-auto"
          >
            <Shuffle
              text="DAYFLOW"
              shuffleDirection="up"
              duration={0.4}
              animationMode="evenodd"
              shuffleTimes={3}
              ease="power3.out"
              stagger={0.05}
              triggerOnce={true}
              triggerOnHover={true}
              className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-foreground tracking-tight"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-muted-foreground font-light max-w-2xl mx-auto text-balance pointer-events-none"
          >
            Human Resource Management, Simplified.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto relative z-20"
          >
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all shadow-md group w-full sm:w-auto justify-center"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border-2 border-border text-foreground px-10 py-4 rounded-lg text-lg font-medium hover:bg-secondary/50 transition-colors w-full sm:w-auto justify-center"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-border" />
      </div>

      {/* Product Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">What Dayflow Does</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Everything your team needs
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Built for the way Indian businesses actually work — from daily check-ins to monthly payslips.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <AnimatedSection key={cap.title}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="group p-6 rounded-xl border border-border bg-card hover:warm-shadow-md transition-shadow h-full"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/12 transition-colors">
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{cap.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Employee vs HR Experience */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Two Perspectives, One Platform</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Designed for everyone
            </h2>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2">
            <AnimatedSection>
              <div className="bg-card rounded-xl border border-border p-8 h-full warm-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">For Employees</h3>
                <ul className="space-y-3">
                  {[
                    "Check in and out with a single click",
                    "Apply for leave and track approval status",
                    "View detailed payslips with INR breakdown",
                    "See your attendance history at a glance",
                    "Manage your profile and personal details",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-[hsl(var(--success))] mt-0.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-card rounded-xl border border-border p-8 h-full warm-shadow">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-accent" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">For HR Managers</h3>
                <ul className="space-y-3">
                  {[
                    "View real-time workforce and attendance analytics",
                    "Approve or reject leave requests instantly",
                    "Manage employee directory with search",
                    "Oversee company-wide payroll records",
                    "Role-based access with secure authentication",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Simple By Design</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              How it works
            </h2>
          </AnimatedSection>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number}>
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display text-lg font-bold shrink-0">
                    {step.number}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="ml-7 mt-4 mb-0 h-6 w-px bg-border" />
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Built for reliability
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Modern technology stack designed for Indian HR workflows.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Secure by Default",
                description: "Role-based access control, JWT authentication, and encrypted data handling.",
              },
              {
                icon: Zap,
                title: "Fast & Responsive",
                description: "Optimized for desktop and mobile. Works on any device, any screen size.",
              },
              {
                icon: Globe,
                title: "Made for India",
                description: "INR formatting, Indian date standards, and workflows that match how Indian companies operate.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title}>
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Ready to simplify your HR?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start managing attendance, leave, and payroll — all from one place.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg text-base font-medium hover:bg-primary/90 transition-all warm-shadow-md hover:warm-shadow-lg group"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 mb-6 sm:mb-0">
            <img src="/logo.jpeg" alt="Dayflow Logo" className="h-8 w-auto rounded-sm grayscale opacity-70" />
            <span className="font-display text-lg font-bold text-foreground">Dayflow</span>
            <span className="text-sm text-muted-foreground">— Human Resource Management</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
