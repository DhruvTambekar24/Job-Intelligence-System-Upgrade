// 'use client'

// import { MainLayout } from '@/components/main-layout'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { recommendationsData } from '@/lib/mock-data'
// import { Zap, ArrowRight, Star } from 'lucide-react'

// export default function RecommendationsPage() {
//   return (
//     <MainLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div>
//           <h1 className="text-4xl font-bold mb-2">Skill Recommendations</h1>
//           <p className="text-lg text-muted-foreground">AI-powered suggestions based on market demand and your profile</p>
//         </div>

//         {/* Recommendations Grid */}
//         <div className="space-y-4">
//           {recommendationsData.map((rec, index) => (
//             <Card
//               key={rec.id}
//               className="bg-card/50 border-border/50 backdrop-blur hover:border-primary/50 transition-colors overflow-hidden"
//             >
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
//                         <span className="text-lg font-bold text-primary">{index + 1}</span>
//                       </div>
//                       <h3 className="text-2xl font-bold">{rec.skill}</h3>
//                       <div className="flex items-center gap-1 ml-auto">
//                         <Star size={18} className="text-primary fill-primary" />
//                         <span className="font-semibold">{rec.relevance}% match</span>
//                       </div>
//                     </div>
//                     <p className="text-muted-foreground mb-4">{rec.reason}</p>

//                     {/* Relevance Bar */}
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 bg-muted rounded-full h-2">
//                         <div
//                           className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
//                           style={{ width: `${rec.relevance}%` }}
//                         />
//                       </div>
//                       <span className="text-xs text-muted-foreground whitespace-nowrap">Relevance</span>
//                     </div>
//                   </div>

//                   <Button className="ml-4">
//                     {rec.action}
//                     <ArrowRight size={16} />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Additional Info Card */}
//         <Card className="bg-primary/5 border-primary/20 backdrop-blur">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Zap size={24} className="text-primary" />
//               <CardTitle>How Recommendations Work</CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="text-muted-foreground">
//             <p>
//               Our AI analyzes current job market trends, your existing skills, industry growth patterns, and your career goals to suggest the most valuable skills for your professional development. Each recommendation is ranked by relevance to your profile and current market demand.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   )
// }
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { getRecommendations } from "@/lib/api";

export default function RecommendationsPage() {
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Skill gap score
  const gapScore = Math.max(0, 100 - skills.length * 10);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    const skillList = input
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    setSkills(skillList);
    setLoading(true);

    try {
      const res = await getRecommendations(skillList);

      console.log("API RESPONSE:", res); // 🔥 DEBUG

      setRecommendations(res?.recommended_skills || []);
      setAiSummary(res?.ai_summary || "");
    } catch (err) {
      console.error("Recommendation error:", err);
      setRecommendations([]);
      setAiSummary("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Career Recommendations
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyze your skills and get AI-powered career guidance
          </p>
        </div>

        {/* INPUT */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Enter skills (e.g. python, sql, ml)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? "Analyzing..." : "Generate AI Insights"}
            </Button>
          </CardContent>
        </Card>

        {/* 🔥 LOADING */}
        {loading && (
          <p className="text-center text-muted-foreground">
            🔍 AI is analyzing market data...
          </p>
        )}

        {/* 🔥 AI SUMMARY */}
        {!loading && aiSummary && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-primary" />
                Gemini AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground whitespace-pre-line">
              {aiSummary}
            </CardContent>
          </Card>
        )}

        {/* 🔥 SKILL GAP */}
        {!loading && skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" />
                Skill Gap Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-green-500 h-3 rounded-full"
                  style={{ width: `${100 - gapScore}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {gapScore}% gap remaining to reach strong market profile
              </p>
            </CardContent>
          </Card>
        )}

        {/* 🔥 RECOMMENDATIONS */}
        {!loading && recommendations.length > 0 && (
          <div className="space-y-4">
            {recommendations.map((skill, index) => (
              <Card key={skill} className="hover:border-primary transition">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">
                      {index + 1}. {skill}
                    </h3>
                    <p className="text-muted-foreground">
                      High-demand skill to boost your profile
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {/* 🔥 YouTube */}
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://www.youtube.com/results?search_query=${skill}+tutorial`
                        )
                      }
                    >
                      YouTube
                    </Button>

                    {/* 🔥 Coursera */}
                    <Button
                      onClick={() =>
                        window.open(
                          `https://www.coursera.org/search?query=${skill}`
                        )
                      }
                    >
                      Learn
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ❌ EMPTY STATE */}
        {!loading &&
          skills.length > 0 &&
          recommendations.length === 0 && (
            <p className="text-center text-muted-foreground">
              ⚠️ No recommendations found — try adding more skills (e.g. python,
              sql, ml)
            </p>
          )}
      </div>
    </MainLayout>
  );
}