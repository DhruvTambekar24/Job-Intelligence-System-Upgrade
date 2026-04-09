"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobClusters } from "@/lib/api";
import { BarChart3, Layers } from "lucide-react";

type Job = {
  title: string;
  cluster: number;
};

type ClusterCount = {
  cluster: number;
  count: number;
};

export default function ClustersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [distribution, setDistribution] = useState<ClusterCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getJobClusters();
      setJobs(data.jobs || []);
      setDistribution(data.cluster_distribution || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const clusterLabels: Record<number, string> = {
    0: "Misc / Other",
    1: "AI / Data Science",
    2: "Advanced / Specialized",
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Layers className="text-primary" />
            Job Clustering (ML)
          </h1>
          <p className="text-muted-foreground mt-2">
            Machine Learning based grouping of job roles
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-muted-foreground">
            Running ML insights...
          </p>
        )}

        {/* 🔥 Cluster Distribution */}
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary" />
                Cluster Distribution
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {distribution.map((item) => (
                  <div key={item.cluster}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>
                        Cluster {item.cluster} —{" "}
                        {clusterLabels[item.cluster]}
                      </span>
                      <span>{item.count}</span>
                    </div>

                    <div className="w-full bg-muted h-3 rounded">
                      <div
                        className="bg-primary h-3 rounded"
                        style={{
                          width: `${Math.min(item.count / 2, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 🔥 Job List */}
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Clustered Jobs</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {jobs.slice(0, 20).map((job, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-3 rounded border"
                  >
                    <span>{job.title}</span>
                    <span className="text-primary font-semibold">
                      Cluster {job.cluster}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 🔥 Insight */}
        {!loading && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>ML Insight</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground">
              Most jobs fall under{" "}
              <span className="font-semibold text-foreground">
                Cluster 1 (AI / Data Science)
              </span>
              , indicating strong demand for data-driven roles. Smaller clusters
              represent specialized or emerging domains.
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}