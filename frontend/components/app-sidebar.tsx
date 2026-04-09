'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  LineChart,
  Menu,
  Network,
  Briefcase,
  Settings,
  TrendingUp,
  BookOpen,
  X,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { label: 'Recommendations', href: '/recommendations', icon: TrendingUp },
    { label: 'Trends', href: '/trends', icon: LineChart },
    { label: 'Job Board', href: '/jobs', icon: Briefcase },
    { label: 'Skill Relations', href: '/skills', icon: Network },
    { label: 'Job Clusters', href: '/clusters', icon: Layers },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-40 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <TrendingUp size={20} className="text-sidebar-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SkillSight</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-8 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Settings */}
          <div className="px-3 py-4 border-t border-sidebar-border">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
