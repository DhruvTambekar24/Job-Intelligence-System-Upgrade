'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { getJobTrends } from '@/lib/api'

function formatTrends(raw: any[]) {
  // backend returns [{ year: number, month: number, jobs_posted: number }, ...]
  // convert to [{ month: 'YYYY-MM', jobs_posted }]
  const mapped = raw.map((r) => {
    const year = r.year || r?.Year || 0
    const month = r.month || r?.Month || 0
    const jobs = r.jobs_posted ?? r.jobs_posted ?? r.jobs ?? r.count ?? 0
    const mm = String(month).padStart(2, '0')
    return { month: `${year}-${mm}`, jobs_posted: Number(jobs) }
  })
  // sort by month
  mapped.sort((a, b) => (a.month > b.month ? 1 : -1))
  return mapped
}

export default function TrendsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await getJobTrends()
        if (!mounted) return
        const formatted = formatTrends(res || [])
        setData(formatted)
      } catch (err: any) {
        setError(String(err?.message ?? err))
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Market Trends</h1>
          <p className="text-lg text-muted-foreground">Stay updated with the latest job market trends and skill demands</p>
        </div>

        {/* Trend Cards (static summary) */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'AI/ML Roles',
              growth: '+45%',
              trend: 'up',
              description: 'Fastest growing sector',
            },
            {
              title: 'DevOps Demand',
              growth: '+28%',
              trend: 'up',
              description: 'Cloud infrastructure boom',
            },
            {
              title: 'Web Development',
              growth: '+12%',
              trend: 'up',
              description: 'Steady growth continues',
            },
          ].map((item) => (
            <Card key={item.title} className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold text-primary">{item.growth}</div>
                  {item.trend === 'up' ? (
                    <TrendingUp size={20} className="text-green-500 mb-1" />
                  ) : (
                    <TrendingDown size={20} className="text-red-500 mb-1" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="demand" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="demand">Job Demand</TabsTrigger>
            <TabsTrigger value="salary">Salary Trends</TabsTrigger>
            <TabsTrigger value="growth">Growth Rate</TabsTrigger>
          </TabsList>

          <TabsContent value="demand">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Job Openings</CardTitle>
                <CardDescription>Monthly job postings (from backend)</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-destructive">Error: {error}</div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="jobs_posted" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Average Salary Trends</CardTitle>
                <CardDescription>Annual compensation by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Legend />
                    <Bar dataKey="jobs_posted" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Year-over-Year Growth</CardTitle>
                <CardDescription>Growth rate comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { category: 'AI/ML Engineering', growth: 45, color: 'bg-chart-1' },
                    { category: 'DevOps Engineering', growth: 28, color: 'bg-chart-2' },
                    { category: 'Full Stack Development', growth: 12, color: 'bg-chart-3' },
                    { category: 'Data Science', growth: 38, color: 'bg-chart-4' },
                  ].map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-primary font-bold">+{item.growth}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`${item.color} h-3 rounded-full transition-all`}
                          style={{ width: `${item.growth}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
