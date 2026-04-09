// 'use client'

// import { MainLayout } from '@/components/main-layout'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
// import { skillsData, skillRelationsData } from '@/lib/mock-data'
// import { Badge } from '@/components/ui/badge'
// import { ArrowRight, Network } from 'lucide-react'

// export default function SkillsPage() {
//   return (
//     <MainLayout>
//       <div className="space-y-8">
//         {/* Header */}
//         <div>
//           <h1 className="text-4xl font-bold mb-2">Skill Relationships</h1>
//           <p className="text-lg text-muted-foreground">Discover how skills connect and complement each other</p>
//         </div>

//         {/* Your Skills */}
//         <Card className="bg-card/50 border-border/50 backdrop-blur">
//           <CardHeader>
//             <CardTitle>Your Expertise</CardTitle>
//             <CardDescription>Skills you&apos;ve developed so far</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid md:grid-cols-2 gap-6">
//               {skillsData.map((skill) => (
//                 <div key={skill.id} className="p-4 rounded-lg border border-border/50 bg-muted/30">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-lg">{skill.name}</h3>
//                     <Badge className="bg-primary/20 text-primary border-primary/30">
//                       {skill.level}%
//                     </Badge>
//                   </div>
//                   <div className="w-full bg-muted rounded-full h-2">
//                     <div
//                       className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
//                       style={{ width: `${skill.level}%` }}
//                     />
//                   </div>
//                   <p className="text-sm text-primary mt-3 font-semibold">{skill.growth} this year</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Skill Connections */}
//         <Card className="bg-card/50 border-border/50 backdrop-blur">
//           <CardHeader>
//             <CardTitle>Skill Connections</CardTitle>
//             <CardDescription>How skills relate and strengthen each other</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {skillRelationsData.map((relation, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30 hover:border-primary/30 transition-colors"
//                 >
//                   <div className="flex items-center gap-3 flex-1">
//                     <Badge variant="outline" className="bg-primary/10 text-primary">
//                       {relation.source}
//                     </Badge>
//                     <ArrowRight size={18} className="text-muted-foreground" />
//                     <Badge variant="outline" className="bg-accent/10 text-accent">
//                       {relation.target}
//                     </Badge>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold text-primary">{relation.strength}%</div>
//                     <div className="text-xs text-muted-foreground">Relevance</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Skill Network Visualization */}
//         <Card className="bg-card/50 border-border/50 backdrop-blur">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <Network size={24} className="text-primary" />
//               <div>
//                 <CardTitle>Skill Ecosystem</CardTitle>
//                 <CardDescription>Visual representation of skill relationships</CardDescription>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="w-full h-96 bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center">
//               <div className="text-center">
//                 <Network size={48} className="text-primary/50 mx-auto mb-4" />
//                 <p className="text-muted-foreground">
//                   Interactive skill network visualization
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Shows connections and strengthening relationships between skills
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Learning Recommendations */}
//         <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 backdrop-blur">
//           <CardHeader>
//             <CardTitle>Skill Learning Path</CardTitle>
//             <CardDescription>Recommended skills to learn next based on your current expertise</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {[
//                 { skill: 'Python', why: 'Complements your AI/ML growth (25%+)' },
//                 { skill: 'AWS Solutions Architect', why: 'Natural progression from DevOps knowledge' },
//                 { skill: 'GraphQL', why: 'Modern backend technology for React developers' },
//                 { skill: 'Kubernetes', why: 'Essential for cloud-native architecture' },
//               ].map((item) => (
//                 <div key={item.skill} className="flex items-start gap-4 p-4 rounded-lg bg-background/30">
//                   <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
//                     <ArrowRight size={20} className="text-primary" />
//                   </div>
//                   <div>
//                     <div className="font-semibold">{item.skill}</div>
//                     <div className="text-sm text-muted-foreground">{item.why}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   )
// }
"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Network } from "lucide-react";
import { getCooccurrence } from "@/lib/api";

type Relation = {
  skill_1: string;
  skill_2: string;
  count: number;
};

export default function SkillsPage() {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCooccurrence();
        console.log("COOCCURRENCE:", data);
        setRelations(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Skill Relationships (Real Data)
          </h1>
          <p className="text-lg text-muted-foreground">
            Derived from job market analytics using Spark
          </p>
        </div>

        {/* 🔥 Loading */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Loading skill network...
          </p>
        )}

        {/* 🔥 Skill Connections */}
        {!loading && (
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Top Skill Connections</CardTitle>
              <CardDescription>
                Skills that frequently appear together in job descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relations.map((rel, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Badge className="bg-primary/10 text-primary">
                        {rel.skill_1}
                      </Badge>

                      <ArrowRight size={18} />

                      <Badge className="bg-accent/10 text-accent">
                        {rel.skill_2}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary">
                        {rel.count}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Co-occurrence
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 🔥 Insights */}
        {!loading && relations.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="text-primary" />
                <CardTitle>Market Insight</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Skills like{" "}
              <span className="font-semibold text-foreground">
                {relations[0]?.skill_1}
              </span>{" "}
              and{" "}
              <span className="font-semibold text-foreground">
                {relations[0]?.skill_2}
              </span>{" "}
              frequently appear together in job listings, indicating strong
              demand for combined expertise. Learning complementary skills
              increases your chances of getting hired.
            </CardContent>
          </Card>
        )}

        {/* 🔥 Simple Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Network Strength</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relations.slice(0, 5).map((rel, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {rel.skill_1} ↔ {rel.skill_2}
                    </span>
                    <span>{rel.count}</span>
                  </div>

                  <div className="w-full bg-muted h-2 rounded">
                    <div
                      className="bg-primary h-2 rounded"
                      style={{
                        width: `${Math.min(rel.count, 100)}%`,
                      }}
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