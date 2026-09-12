'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Check,
  Church,
  DollarSign,
  Heart,
  Mail,
  Shield,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MembersPricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const currentYear = new Date().getFullYear();
  const plans = [
    {
      name: 'Connect',
      description: 'Perfect for new members',
      price: billingCycle === 'monthly' ? 49 : 499,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      popular: false,
      features: [
        { name: 'Church directory access', included: true },
        { name: 'Event notifications', included: true },
        { name: 'Prayer request submissions', included: true },
        { name: 'Basic giving tools (M-Pesa)', included: true },
        { name: 'Basic profile management', included: true },
        { name: 'Community announcements', included: true },
        { name: 'Email support', included: true },
        { name: 'Small group finder', included: false },
        { name: 'Advanced devotional content', included: false },
        { name: 'Ministry scheduling tools', included: false },
        { name: 'Advanced communication features', included: false },
        { name: 'Volunteer management', included: false },
        { name: 'Event registration', included: false },
        { name: 'Attendance tracking', included: false },
      ],
    },
    {
      name: 'Engage',
      description: 'For active members',
      price: billingCycle === 'monthly' ? 99 : 999,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save KES 189' : null,
      features: [
        { name: 'Full church directory access', included: true },
        { name: 'Event registration & management', included: true },
        { name: 'Prayer circle participation', included: true },
        { name: 'Advanced giving & tithing (M-Pesa)', included: true },
        { name: 'Complete profile management', included: true },
        { name: 'Small group finder & joining', included: true },
        { name: 'Daily devotional content', included: true },
        { name: 'Basic communication tools', included: true },
        { name: 'Attendance self-tracking', included: true },
        { name: 'Volunteer opportunity access', included: true },
        { name: 'Priority support', included: true },
        { name: 'Ministry scheduling tools', included: false },
        { name: 'Advanced volunteer management', included: false },
      ],
    },
    {
      name: 'Serve',
      description: 'Best value for ministry leaders',
      price: billingCycle === 'monthly' ? 149 : 1499,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      popular: false,
      savings: billingCycle === 'yearly' ? 'Save KES 289' : null,
      features: [
        { name: 'Complete church access', included: true },
        { name: 'Unlimited event management', included: true },
        { name: 'Lead prayer groups & circles', included: true },
        { name: 'Advanced giving analytics (M-Pesa)', included: true },
        { name: 'Advanced profile & ministry management', included: true },
        { name: 'small groups management', included: true },
        { name: 'Premium devotional library', included: true },
        { name: 'Advanced communication suite', included: true },
        { name: 'Comprehensive attendance tracking', included: true },
        { name: 'Volunteer coordination & management', included: true },
        { name: 'Ministry scheduling tools', included: true },
        { name: 'Content creation & sharing', included: true },
        { name: 'Discipleship program access', included: true },
        { name: 'Leadership resources', included: true },
        { name: 'Priority support & training', included: true },
      ],
    },
  ];
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description:
        'Your personal information and giving history are protected with bank-level security',
    },
    {
      icon: Calendar,
      title: 'Cancel Anytime',
      description:
        'No long-term commitments. Upgrade or downgrade your membership anytime',
    },
    {
      icon: DollarSign,
      title: 'M-Pesa Integration',
      description:
        'Seamless giving and payments through M-Pesa for convenient transactions',
    },
    {
      icon: Users,
      title: 'Community Connection',
      description:
        'Connect with fellow believers and build meaningful relationships in your faith journey',
    },
  ];
  const faqs = [
    {
      question: 'How does the membership work?',
      answer:
        'Choose the plan that fits your spiritual journey. Start with Connect for basic access, upgrade to Engage for active participation, or choose Serve for ministry leadership opportunities.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept M-Pesa payments for convenient local transactions. All payments are processed securely through our automated M-Pesa integration.',
    },
    {
      question: 'Is my personal and giving data secure?',
      answer:
        'Absolutely. We use enterprise-grade encryption for all personal data and giving records. Your information is never shared with third parties and remains completely confidential.',
    },
    {
      question: 'Can I change my membership plan?',
      answer:
        'Yes! You can upgrade or downgrade your membership plan anytime. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.',
    },
    {
      question: 'What happens if I cancel my membership?',
      answer:
        "You can cancel anytime with no penalties. You'll continue to have access to paid features until the end of your current billing period, then automatically move to basic access.",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 shadow-sm backdrop-blur-md transition-colors duration-300 dark:bg-gray-900/90">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Church className="h-8 w-8 text-blue-600" />
              <div className="-top-1 -right-1 absolute h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-2xl text-transparent">
              ChurchHub
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/">
              <Button
                className="hover:bg-blue-50 dark:hover:bg-gray-800"
                variant="ghost"
              >
                Home
              </Button>
            </Link>
            <Link href="/request-demo">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                Free Demo
              </Button>
            </Link>
            <Link href="/auth/member">
              <Button
                className="hover:bg-blue-50 dark:hover:bg-gray-800"
                variant="ghost"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-5xl text-foreground">
            Simple, Faithful <span className="text-blue-600">Membership</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
            Choose the perfect membership level for your spiritual journey. All
            plans help you connect deeper with your faith community and grow in
            your walk with God through our comprehensive platform.
          </p>
          {/* Billing Toggle */}
          <div className="mb-12 inline-flex items-center rounded-lg bg-muted p-1">
            <button
              className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-background text-blue-600 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingCycle('monthly')}
              type="button"
            >
              Monthly
            </button>
            <button
              className={`rounded-md px-4 py-2 font-medium text-sm transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-background text-blue-600 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setBillingCycle('yearly')}
              type="button"
            >
              Yearly{' '}
              <span className="ml-1 font-semibold text-green-600">
                (Save 17%)
              </span>
            </button>
          </div>
        </div>
        {/* Pricing Cards */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              className={`relative rounded-2xl border-2 bg-background shadow-lg transition-all hover:shadow-xl ${
                plan.popular
                  ? 'scale-105 border-blue-500 lg:scale-110'
                  : 'border-border hover:border-blue-300'
              }`}
              key={index}
            >
              {plan.popular && (
                <>
                  <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
                    <span className="rounded-full bg-blue-600 px-4 py-1 font-medium text-sm text-white">
                      Most Popular
                    </span>
                  </div>
                  {plan.savings && (
                    <div className="-top-4 absolute right-4">
                      <span className="rounded-full bg-green-500 px-3 py-1 font-medium text-sm text-white">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="mb-2 font-bold text-2xl text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mb-4 text-muted-foreground">{plan.description}</p>
                  <div className="mb-1 flex items-baseline">
                    <span className="font-bold text-5xl text-foreground">
                      KES {plan.price.toLocaleString()}
                    </span>
                    <span className="ml-1 text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Pay conveniently via M-Pesa
                  </p>
                </div>
                <ul className="mb-8 max-h-80 space-y-4 overflow-y-auto">
                  {plan.features.map((feature, featureIndex) => (
                    <li className="flex items-start" key={featureIndex}>
                      <div className="mr-3 flex-shrink-0">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {/* Features Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-foreground">
            Everything you need for spiritual growth
          </h2>
          <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                className="flex flex-col items-center space-y-4 text-center"
                key={index}
              >
                <div className="flex-shrink-0">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* FAQ Section */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-bold text-3xl text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="mb-3 font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Heart className="h-6 w-6" />
                <span className="font-bold text-xl">ChurchHub Members</span>
              </div>
              <p className="mb-4 text-muted-foreground">
                Connecting believers in meaningful community. Grow in your
                faith, serve others, and build lasting relationships with fellow
                members through our comprehensive platform.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link className="text-muted-foreground hover:text-white" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-white"
                    href="/pricing/members"
                  >
                    Membership
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-white"
                    href="/auth/member"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Support</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-muted-foreground">Member Support</span>
                </li>
                <li>
                  <Link className="text-muted-foreground hover:text-white" href="/">
                    Prayer Requests
                  </Link>
                </li>
                <li>
                  <Link className="text-muted-foreground hover:text-white" href="/">
                    Faith Resources
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-gray-700 border-t pt-8 md:flex-row">
            <p className="text-muted-foreground">
              © {currentYear} ChurchHub Members. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link className="text-muted-foreground hover:text-white" href="/">
                Privacy Policy
              </Link>
              <Link className="text-muted-foreground hover:text-white" href="/">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
