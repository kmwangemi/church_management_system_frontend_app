'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Church,
  DollarSign,
  Globe,
  Heart,
  MessageSquare,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/use-auth';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user: session, isLoading } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (!isLoading && session) {
      const role = session.role?.toLowerCase() || '';
      const globalRole = session.globalRole?.toLowerCase() || '';
      if (globalRole === 'superadmin' || role === 'superadmin') {
        router.push('/superadmin');
      } else if (['admin', 'owner', 'staff'].includes(role)) {
        router.push('/church');
      } else {
        router.push('/member');
      }
    }
  }, [session, isLoading, router]);

  const partners = [
    { name: 'Covenant Church Network', logo: '⛪' },
    { name: 'Faith Community Alliance', logo: '✝️' },
    { name: 'Gospel Outreach Ministry', logo: '🕊️' },
    { name: 'Pentecostal Assembly', logo: '🔥' },
    { name: 'Baptist Convention', logo: '📖' },
    { name: 'Methodist Conference', logo: '⭐' },
    { name: 'Catholic Diocese', logo: '✨' },
    { name: 'Presbyterian Synod', logo: '🏛️' },
    { name: 'Evangelical Fellowship', logo: '🌟' },
    { name: 'Anglican Communion', logo: '👑' },
  ];
  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return; // Fix for TypeScript null check
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    // Update scroll buttons state
    setTimeout(() => {
      if (!container) return;
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }, 300);
  };
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button
                  className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-800"
                  variant="ghost"
                >
                  Pricing
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/shared/pricing/member">
                  <DropdownMenuItem className="cursor-pointer">
                    Member Pricing
                  </DropdownMenuItem>
                </Link>
                <Link href="/shared/pricing/church">
                  <DropdownMenuItem className="cursor-pointer">
                    Church Pricing
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/shared/request-demo">
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
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="container relative mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 font-medium text-blue-800 text-sm shadow-lg">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Trusted by 100+ Churches Worldwide</span>
              <Award className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <h1 className="mb-8 font-bold text-6xl text-foreground leading-tight md:text-7xl">
            Complete Church Management
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-muted-foreground text-xl leading-relaxed md:text-2xl">
            Streamline your church operations with our comprehensive management
            solution. Handle members, finances, events, assets, and spiritual
            growth all in one place.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Link href="/shared/request-demo">
              <Button
                className="transform bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-lg shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl"
                size="lg"
              >
                <Zap className="mr-2 h-5 w-5" />
                Request a Demo
              </Button>
            </Link>
            <Link href="/auth/member">
              <Button
                className="transform border-2 border-blue-600 bg-transparent px-10 py-4 text-blue-600 text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:text-white hover:shadow-xl"
                size="lg"
                variant="outline"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Login
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Mobile-first design</span>
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-20 text-center">
            <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
              Everything Your Church Needs
            </h2>
            <p className="mx-auto max-w-3xl text-muted-foreground text-xl leading-relaxed">
              From member management to financial tracking, our platform
              provides all the tools you need to grow and manage your church
              effectively.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: 'Member Management',
                description:
                  'Complete member profiles with role-based access, attendance tracking, and department organization',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
              },
              {
                icon: DollarSign,
                title: 'Financial Management',
                description:
                  'Track tithes, offerings, pledges with mobile payment integration including M-Pesa API',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
              },
              {
                icon: Calendar,
                title: 'Event Management',
                description:
                  'Schedule services, meetings, and special events with RSVP tracking and automated reminders',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50',
              },
              {
                icon: BarChart3,
                title: 'Analytics & Reports',
                description:
                  'Comprehensive reports on attendance trends, giving patterns, and church growth statistics',
                color: 'text-orange-600',
                bgColor: 'bg-orange-50',
              },
              {
                icon: MessageSquare,
                title: 'Communication Hub',
                description:
                  'SMS/Email alerts via Twilio & SendGrid, member notification board, and announcement system',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
              },
              {
                icon: Heart,
                title: 'Discipleship Tracking',
                description:
                  'Track new converts, discipleship class progression, and spiritual growth milestones',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
              },
              {
                icon: Shield,
                title: 'Asset Management',
                description:
                  'Manage church assets including vehicles, schools, equipment with maintenance scheduling',
                color: 'text-muted-foreground',
                bgColor: 'bg-accent',
              },
              {
                icon: Church,
                title: 'Multi-Branch Support',
                description:
                  'Hierarchical structure for multiple church locations and department management',
                color: 'text-indigo-600',
                bgColor: 'bg-indigo-50',
              },
            ].map((feature, index) => (
              <Card
                className="group hover:-translate-y-2 border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
                key={index}
              >
                <CardHeader className="text-center">
                  <div
                    className={`mx-auto mb-4 h-16 w-16 ${feature.bgColor} flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="mb-3 text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-20 text-center">
            <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
              Loved by Church Leaders
            </h2>
            <p className="text-muted-foreground text-xl">
              See what pastors and administrators are saying about ChurchHub
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                rating: 5,
                text: 'ChurchHub has transformed how we manage our congregation. The member management and financial tracking features are exactly what we needed.',
                author: 'Pastor John Smith',
                position: 'Grace Community Church',
              },
              {
                rating: 5,
                text: 'The asset management feature helps us keep track of all our church properties and vehicles. The maintenance scheduling is a game-changer.',
                author: 'Sarah Johnson',
                position: 'Church Administrator',
              },
              {
                rating: 5,
                text: 'The discipleship tracking and communication features have helped us better connect with our members and track their spiritual growth.',
                author: 'Bishop Michael Brown',
                position: 'New Life Cathedral',
              },
            ].map((testimonial, index) => (
              <Card
                className="group hover:-translate-y-1 border-0 shadow-lg transition-all duration-300 hover:shadow-xl"
                key={index}
              >
                <CardHeader className="text-center">
                  <div className="mb-4 flex items-center justify-center space-x-1">
                    {[...new Array(testimonial.rating)].map((_, i) => (
                      <Star
                        className="h-5 w-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110"
                        key={i}
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <CardDescription className="mb-6 text-muted-foreground text-lg leading-relaxed">
                    "{testimonial.text}"
                  </CardDescription>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-foreground text-lg">
                      {testimonial.author}
                    </p>
                    <p className="font-medium text-blue-600">
                      {testimonial.position}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Church Partners Section */}
      <section className="bg-background px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <p className="mb-4 font-semibold text-blue-600 text-lg">
              Ministry Partners we're blessed to serve
            </p>
            <h2 className="mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text font-bold text-4xl text-transparent md:text-5xl">
              Churches that are
              <span className="block">blessed with ChurchHub</span>
            </h2>
          </div>
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              className={`-translate-y-1/2 absolute top-1/2 left-0 z-10 rounded-full border bg-background p-3 shadow-lg transition-all duration-300 ${
                canScrollLeft
                  ? 'text-muted-foreground hover:scale-110 hover:shadow-xl'
                  : 'cursor-not-allowed text-muted-foreground'
              }`}
              disabled={!canScrollLeft}
              onClick={() => handleScroll('left')}
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className={`-translate-y-1/2 absolute top-1/2 right-0 z-10 rounded-full border bg-background p-3 shadow-lg transition-all duration-300 ${
                canScrollRight
                  ? 'text-muted-foreground hover:scale-110 hover:shadow-xl'
                  : 'cursor-not-allowed text-muted-foreground'
              }`}
              disabled={!canScrollRight}
              onClick={() => handleScroll('right')}
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            {/* Scrollable Container */}
            <div
              className="scrollbar-hide flex space-x-8 overflow-x-auto px-12 py-8"
              ref={scrollRef}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {partners.map((partner, index) => (
                <div className="group flex-shrink-0" key={index}>
                  <div className="hover:-translate-y-2 flex h-32 w-48 flex-col items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-white shadow-md transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
                    <div className="mb-2 text-4xl transition-transform duration-300 group-hover:scale-110">
                      {partner.logo}
                    </div>
                    <div className="px-4 text-center">
                      <h3 className="font-semibold text-foreground text-sm leading-tight transition-colors duration-300 group-hover:text-blue-600">
                        {partner.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-4 py-24 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative mx-auto text-center">
          <h2 className="mb-8 font-bold text-4xl leading-tight md:text-5xl">
            Ready to Transform Your Church Management?
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-blue-100 text-xl leading-relaxed md:text-2xl">
            Join hundreds of churches already using ChurchHub to streamline
            operations and focus on what matters most - ministry.
          </p>
          <Link href="/shared/request-demo">
            <Button
              className="transform bg-background px-12 py-4 text-lg text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-muted hover:shadow-3xl"
              size="lg"
            >
              <Globe className="mr-2 h-5 w-5" />
              Request a Demo
            </Button>
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-16 text-white">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-6 flex items-center space-x-3">
                <Church className="h-8 w-8 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-2xl text-transparent">
                  ChurchHub
                </span>
              </div>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Empowering churches with comprehensive management solutions for
                growth and ministry excellence.
              </p>
            </div>
            <div>
              <h3 className="mb-6 font-semibold text-lg">Features</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="cursor-pointer transition-colors hover:text-white">
                  Member Management
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Financial Tracking
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Event Planning
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Asset Management
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 font-semibold text-lg">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="cursor-pointer transition-colors hover:text-white">
                  Help Center
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Documentation
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Contact Support
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Training
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 font-semibold text-lg">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="cursor-pointer transition-colors hover:text-white">
                  About Us
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Privacy Policy
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Terms of Service
                </li>
                <li className="cursor-pointer transition-colors hover:text-white">
                  Blog
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-gray-800 border-t pt-8 text-center text-muted-foreground">
            <p>
              © {currentYear} ChurchHub. All rights reserved. Built with ❤️ for
              the Kingdom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
