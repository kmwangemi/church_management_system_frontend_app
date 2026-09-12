'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Building,
  Calendar,
  Check,
  Church,
  DollarSign,
  Mail,
  Shield,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ChurchPricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const currentYear = new Date().getFullYear();
  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for small congregations',
      price: billingCycle === 'monthly' ? 2999 : 29_999,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      popular: false,
      features: [
        { name: 'Up to 100 members', included: true },
        { name: 'Basic user management', included: true },
        { name: '5 Branch locations', included: true },
        { name: 'Basic departments', included: true },
        { name: 'Small groups (up to 10)', included: true },
        { name: 'Basic attendance tracking', included: true },
        { name: 'Event scheduling', included: true },
        { name: 'Basic finance tracking', included: true },
        { name: 'Prayer request management', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced reporting', included: false },
        { name: 'Multi-branch support', included: false },
        { name: 'Advanced communication tools', included: false },
        { name: 'Discipleship programs', included: false },
        { name: 'Volunteer management', included: false },
        { name: 'Asset management', included: false },
        { name: 'Content management', included: false },
        { name: 'Advanced contributions tracking', included: false },
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      name: 'Ministry',
      description: 'For growing churches',
      price: billingCycle === 'monthly' ? 4999 : 49_999,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save KES 9,989' : null,
      features: [
        { name: 'Up to 500 members', included: true },
        { name: 'Advanced user management', included: true },
        { name: 'Up to 20 branch locations', included: true },
        { name: 'Department management', included: true },
        { name: 'Unlimited small groups', included: true },
        { name: 'Advanced attendance tracking', included: true },
        { name: 'Event scheduling & registration', included: true },
        { name: 'Finance & budget management', included: true },
        { name: 'Contributions tracking', included: true },
        { name: 'Basic asset management', included: true },
        { name: 'Communication tools', included: true },
        { name: 'Prayer request management', included: true },
        { name: 'Basic discipleship programs', included: true },
        { name: 'Volunteer scheduling', included: true },
        { name: 'Basic reporting', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced content management', included: false },
        { name: 'Comprehensive reporting', included: false },
      ],
      buttonText: 'Start Ministry Plan',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    },
    {
      name: 'Cathedral',
      description: 'Complete solution for large congregations',
      price: billingCycle === 'monthly' ? 9999 : 99_999,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      popular: false,
      savings: billingCycle === 'yearly' ? 'Save KES 19,989' : null,
      features: [
        { name: 'Unlimited members', included: true },
        { name: 'Complete user management', included: true },
        { name: 'Unlimited branch locations', included: true },
        { name: 'Advanced department management', included: true },
        { name: 'Unlimited small groups', included: true },
        { name: 'Advanced attendance analytics', included: true },
        { name: 'Advanced event management', included: true },
        { name: 'Complete finance management', included: true },
        { name: 'Advanced contributions tracking', included: true },
        { name: 'Complete asset management', included: true },
        { name: 'Advanced communication suite', included: true },
        { name: 'Prayer & pastoral care', included: true },
        { name: 'Complete discipleship programs', included: true },
        { name: 'Advanced volunteer management', included: true },
        { name: 'Content management system', included: true },
        { name: 'Comprehensive reporting & analytics', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Priority support & training', included: true },
      ],
      buttonText: 'Start Cathedral Plan',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    },
  ];
  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        "Your congregation's data is encrypted and never shared with third parties",
    },
    {
      icon: Calendar,
      title: 'Cancel Anytime',
      description: 'No long-term contracts. Cancel your subscription anytime',
    },
    {
      icon: DollarSign,
      title: 'M-Pesa Integration',
      description:
        'Seamless payments through M-Pesa for convenient transactions',
    },
    {
      icon: Building,
      title: 'Multi-Branch Support',
      description:
        'Manage multiple church locations from one central dashboard',
    },
  ];
  const faqs = [
    {
      question: 'How does the free trial work?',
      answer:
        'Start with a 14-day free trial of any plan. No credit card required. Experience all features before you commit.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept M-Pesa payments for convenient local transactions. Payments are processed securely through our automated M-Pesa integration.',
    },
    {
      question: "Is my congregation's data secure?",
      answer:
        'Absolutely. We use bank-level encryption and follow international security standards. Your member data is private, secure, and never shared.',
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer:
        'Yes, you can change your plan anytime. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.',
    },
    {
      question: 'Do you offer training and support?',
      answer:
        'Yes! All plans include comprehensive onboarding, video tutorials, and ongoing support. Cathedral plan includes priority support and personalized training sessions.',
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
            Simple, Transparent <span className="text-blue-600">Pricing</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
            Choose the perfect plan for your ministry goals. All plans include
            comprehensive church management tools with M-Pesa integration for
            seamless operations.
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
                <Button className={`w-full ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Features Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl text-foreground">
            Everything you need to grow your ministry
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
                <Church className="h-6 w-6" />
                <span className="font-bold text-xl">ChurchHub</span>
              </div>
              <p className="mb-4 text-muted-foreground">
                Comprehensive church management system that helps you grow your
                ministry with features tailored for modern churches.
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
                    href="/pricing/church"
                  >
                    Pricing
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
                  <span className="text-muted-foreground">Contact Support</span>
                </li>
                <li>
                  <Link className="text-muted-foreground hover:text-white" href="/">
                    Feature Request
                  </Link>
                </li>
                <li>
                  <Link className="text-muted-foreground hover:text-white" href="/">
                    Ministry Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-gray-700 border-t pt-8 md:flex-row">
            <p className="text-muted-foreground">
              © {currentYear} ChurchHub. All rights reserved.
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
