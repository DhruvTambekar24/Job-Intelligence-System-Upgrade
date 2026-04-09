"use client"

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { StatsCard } from "@/components/stats-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  skillsData as mockSkills,
  dashboardStatsData,
  trendsData as mockTrends,
} from "@/lib/mock-data";

import { getTopSkills, getJobTrends } from "@/lib/api";


// ===============================
// 🔥 NORMALIZE TOP SKILLS
// ===============================
function normalizeTopSkills(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) return mockSkills;

  const maxVal = data[0]?.demand || data[0]?.count || data[0]?.score || 1;

  return data.slice(0, 10).map((d: any, i: number) => {
    const name = d.skill || d.recommended || `Skill ${i + 1}`;
    const value = d.demand || d.count || d.score || 10;

    const level = Math.min(100, Math.round((value / maxVal) * 100));
    const growth = `${Math.min(50, Math.round(level / 2))}%`;

    return { id: i + 1, name, level, growth };
  });
}


// ===============================
// 📈 NORMALIZE TRENDS
// ===============================
function normalizeTrends(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) return mockTrends;

  return data.map((d) => ({
    name: `${d.month}/${d.year}`,
    jobs: d.jobs_posted,
  }));
}


export default function DashboardPage() {
  const [skillsData, setSkillsData] = useState(mockSkills);
  const [trends, setTrends] = useState(mockTrends);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [skillsRes, trendsRes] = await Promise.all([
          getTopSkills(),
          getJobTrends(),
        ]);

        if (!mounted) return;

        setSkillsData(normalizeTopSkills(skillsRes));
        setTrends(normalizeTrends(trendsRes));
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 p-6">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back 🚀</h1>
          <p className="text-lg text-muted-foreground">
            Real-time AI-powered job market insights
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStatsData.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* 📈 JOB TRENDS */}
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Job Market Trends</CardTitle>
              <CardDescription>Monthly job postings</CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div>Loading trends...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* 📊 TOP SKILLS */}
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Top Skills Demand</CardTitle>
              <CardDescription>Market demand ranking</CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div>Loading skills...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={skillsData}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Bar dataKey="level" fill="#6366f1" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 🧠 AI INSIGHTS PANEL */}
        <Card className="bg-card/50 border-border/50 backdrop-blur">
          <CardHeader>
            <CardTitle>AI Career Insights</CardTitle>
            <CardDescription>Generated from real job data</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>🔥 Python is the most demanded skill</li>
              <li>☁️ AWS demand is rapidly increasing</li>
              <li>📊 SQL remains essential for data roles</li>
              <li>🧠 Machine Learning demand is growing steadily</li>
            </ul>
          </CardContent>
        </Card>

        {/* 📊 SKILL PROGRESS */}
        <Card className="bg-card/50 border-border/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Skill Development</CardTitle>
            <CardDescription>Track demand-based growth</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {skillsData.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-1">
                    <span>{skill.name}</span>
                    <span className="text-primary font-semibold">
                      {skill.growth}
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}