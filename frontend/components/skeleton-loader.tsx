import { Card, CardContent } from '@/components/ui/card'

export function SkeletonCard() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded-full w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded-full w-1/2 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="h-4 bg-muted rounded-full w-1/2 animate-pulse mb-3" />
            <div className="h-8 bg-muted rounded-lg w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
