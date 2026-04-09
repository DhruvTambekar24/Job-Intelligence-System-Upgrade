'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, TrendingUp, Brain, Target } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:via-background dark:to-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp size={18} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SkillSight</span>
          </div>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in-up">
            <Zap size={16} />
            <span className="text-sm font-medium">AI-Powered Career Insights</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Discover Your Next Career Move
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            AI-powered skill recommendations, job matching, and career trend analysis all in one place. Level up your professional growth with data-driven insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Explore Dashboard
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Feature Preview */}
          <div className="rounded-2xl border border-border/50 overflow-hidden shadow-2xl bg-card">
            <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={48} className="text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-card/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need for career advancement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI Recommendations',
                description: 'Get personalized skill recommendations based on your profile and market trends.',
              },
              {
                icon: TrendingUp,
                title: 'Trend Analysis',
                description: 'Stay ahead with real-time insights into emerging skills and job market shifts.',
              },
              {
                icon: Target,
                title: 'Smart Job Matching',
                description: 'Discover opportunities that align with your skills and career goals.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-border/50 bg-background/50 backdrop-blur hover:border-primary/50 transition-colors"
              >
                <feature.icon size={32} className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Level Up?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start exploring your career potential today with SkillSight's AI-powered platform.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Launch Dashboard
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6 bg-card/30 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp size={18} className="text-primary-foreground" />
            </div>
            <span className="font-semibold">SkillSight</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SkillSight. Your career growth partner powered by AI.
          </p>
        </div>
      </footer>
    </div>
  )
}
