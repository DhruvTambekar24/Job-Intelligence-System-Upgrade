import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Briefcase, Flame, Award } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: 'trending-up' | 'briefcase' | 'flame' | 'award'
}

const iconMap = {
  'trending-up': TrendingUp,
  'briefcase': Briefcase,
  'flame': Flame,
  'award': Award,
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const Icon = iconMap[icon]

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon size={20} className="text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  )
}
