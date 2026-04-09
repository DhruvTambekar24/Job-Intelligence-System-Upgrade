// "use client";

// import { useEffect, useState } from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, ExternalLink, Search } from "lucide-react";
// import { getJobs } from "@/lib/api";

// export default function JobsPage() {
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [skill, setSkill] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedJob, setSelectedJob] = useState<any>(null);

//   // 🔥 Fetch jobs
//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       let url = `/jobs?page=${page}`;
//       if (search) url += `&search=${search}`;
//       if (skill) url += `&skill=${skill}`;

//       const res = await fetch(`http://127.0.0.1:8000${url}`);
//       const data = await res.json();

//       setJobs(data.jobs || []);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, [page]);

//   return (
//     <MainLayout>
//       <div className="space-y-8">
//         {/* HEADER */}
//         <div>
//           <h1 className="text-4xl font-bold">🚀 Job Board</h1>
//           <p className="text-muted-foreground">
//             Real-time opportunities powered by AI + Big Data
//           </p>
//         </div>

//         {/* 🔍 SEARCH + FILTER */}
//         <div className="flex gap-4">
//           <Input
//             placeholder="Search jobs (e.g. data scientist)"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <Input
//             placeholder="Filter by skill (e.g. python)"
//             value={skill}
//             onChange={(e) => setSkill(e.target.value)}
//           />

//           <Button onClick={() => { setPage(1); fetchJobs(); }}>
//             <Search size={16} />
//           </Button>
//         </div>

//         {/* 🔥 JOB LIST */}
//         {loading && <p>Loading jobs...</p>}

//         {!loading && jobs.length === 0 && (
//           <p className="text-muted-foreground text-center">
//             No jobs found
//           </p>
//         )}

//         <div className="space-y-4">
//           {jobs.map((job) => {
//             const match = Math.min(95, (job.skills?.length || 1) * 15);

//             return (
//               <Card key={job.job_id} className="hover:border-primary transition">
//                 <CardContent className="p-6">
//                   <div className="flex justify-between gap-6">
//                     {/* LEFT */}
//                     <div className="flex-1">
//                       <h2 className="text-xl font-bold">{job.title}</h2>

//                       <p className="text-muted-foreground">
//                         {job.company}
//                       </p>

//                       <div className="flex items-center gap-2 text-sm mt-1">
//                         <MapPin size={14} />
//                         {job.location}
//                       </div>

//                       {/* SKILLS */}
//                       <div className="flex flex-wrap gap-2 mt-3">
//                         {job.skills?.map((s: string) => (
//                           <Badge key={s}>{s}</Badge>
//                         ))}
//                       </div>

//                       {/* DESCRIPTION */}
//                       <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
//                         {job.description}
//                       </p>
//                     </div>

//                     {/* RIGHT */}
//                     <div className="flex flex-col items-end gap-3">
//                       {/* MATCH */}
//                       <div className="text-center">
//                         <div className="text-xl font-bold text-primary">
//                           {match}%
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           Match
//                         </div>
//                       </div>

//                       {/* ACTIONS */}
//                       <Button
//                         variant="outline"
//                         onClick={() => setSelectedJob(job)}
//                       >
//                         View
//                       </Button>

//                       <Button
//                         onClick={() => window.open(job.apply_link)}
//                       >
//                         Apply
//                         <ExternalLink size={14} />
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* 🔄 PAGINATION */}
//         <div className="flex justify-center gap-4">
//           <Button
//             variant="outline"
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//           >
//             Prev
//           </Button>

//           <span className="flex items-center">Page {page}</span>

//           <Button
//             onClick={() => setPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </div>

//         {/* 🔥 JOB DETAIL MODAL */}
//         {selectedJob && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-background p-6 rounded-lg max-w-2xl w-full space-y-4">
//               <h2 className="text-2xl font-bold">{selectedJob.title}</h2>

//               <p className="text-muted-foreground">
//                 {selectedJob.company} • {selectedJob.location}
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 {selectedJob.skills?.map((s: string) => (
//                   <Badge key={s}>{s}</Badge>
//                 ))}
//               </div>

//               <p className="text-sm whitespace-pre-line">
//                 {selectedJob.description}
//               </p>

//               <div className="flex justify-between">
//                 <Button
//                   variant="outline"
//                   onClick={() => setSelectedJob(null)}
//                 >
//                   Close
//                 </Button>

//                 <Button
//                   onClick={() => window.open(selectedJob.apply_link)}
//                 >
//                   Apply Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* INFO */}
//         <Card className="bg-primary/5 border-primary/20">
//           <CardContent className="p-6 text-muted-foreground">
//             ⚡ Powered by Spark + HDFS + AI recommendations
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   );
// }


// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import { MainLayout } from "@/components/main-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { MapPin, ExternalLink, Search } from "lucide-react";
// import { getJobs } from "@/lib/api";

// // -------------------------------
// // 🔥 DEBOUNCE HOOK
// // -------------------------------
// function useDebounce(value: string, delay = 500) {
//   const [debounced, setDebounced] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);

//   return debounced;
// }

// // -------------------------------
// // 🔥 CACHE
// // -------------------------------
// const jobCache = new Map<string, any[]>();

// // -------------------------------
// // 🔥 SKELETON CARD
// // -------------------------------
// const SkeletonCard = () => (
//   <div className="animate-pulse p-6 border rounded-lg space-y-3">
//     <div className="h-6 bg-muted rounded w-1/2"></div>
//     <div className="h-4 bg-muted rounded w-1/3"></div>
//     <div className="flex gap-2">
//       <div className="h-6 w-16 bg-muted rounded"></div>
//       <div className="h-6 w-16 bg-muted rounded"></div>
//     </div>
//     <div className="h-4 bg-muted rounded w-full"></div>
//   </div>
// );

// export default function JobsPage() {
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [skill, setSkill] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedJob, setSelectedJob] = useState<any>(null);

//   const debouncedSearch = useDebounce(search, 500);
//   const debouncedSkill = useDebounce(skill, 500);

//   // -------------------------------
//   // 🔥 FETCH JOBS WITH CACHE
//   // -------------------------------
//   const fetchJobs = async (reset = false) => {
//     const cacheKey = `${page}-${debouncedSearch}-${debouncedSkill}`;

//     if (jobCache.has(cacheKey)) {
//       const cached = jobCache.get(cacheKey)!;
//       setJobs(reset ? cached : [...jobs, ...cached]);
//       return;
//     }

//     setLoading(true);

//     try {
//       const data = await getJobs({
//         page,
//         search: debouncedSearch,
//         skill: debouncedSkill,
//       });

//       const newJobs = data.jobs || [];

//       jobCache.set(cacheKey, newJobs);

//       setJobs(reset ? newJobs : [...jobs, ...newJobs]);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------------
//   // 🔥 RESET ON SEARCH CHANGE
//   // -------------------------------
//   useEffect(() => {
//     setPage(1);
//     setJobs([]);
//     fetchJobs(true);
//   }, [debouncedSearch, debouncedSkill]);

//   // -------------------------------
//   // 🔥 LOAD MORE ON PAGE CHANGE
//   // -------------------------------
//   useEffect(() => {
//     fetchJobs();
//   }, [page]);

//   // -------------------------------
//   // 🔥 INFINITE SCROLL
//   // -------------------------------
//   const observer = useRef<IntersectionObserver | null>(null);

//   const lastJobRef = useCallback(
//     (node: any) => {
//       if (loading) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           setPage((prev) => prev + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading]
//   );

//   return (
//     <MainLayout>
//       <div className="space-y-8">
//         {/* HEADER */}
//         <div>
//           <h1 className="text-4xl font-bold">🚀 Job Board</h1>
//           <p className="text-muted-foreground">
//             Real-time opportunities powered by AI + Big Data
//           </p>
//         </div>

//         {/* 🔍 SEARCH */}
//         <div className="sticky top-0 z-10 bg-background pb-4 flex gap-4">
//           <Input
//             placeholder="Search jobs (e.g. data scientist)"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <Input
//             placeholder="Filter by skill (e.g. python)"
//             value={skill}
//             onChange={(e) => setSkill(e.target.value)}
//           />

//           <Button>
//             <Search size={16} />
//           </Button>
//         </div>

//         {/* 🔥 SKELETON */}
//         {loading && jobs.length === 0 && (
//           <div className="space-y-4">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <SkeletonCard key={i} />
//             ))}
//           </div>
//         )}

//         {/* 🔥 JOB LIST */}
//         <div className="space-y-4">
//           {jobs.map((job, index) => {
//             const isLast = index === jobs.length - 1;
//             const match = Math.min(95, (job.skills?.length || 1) * 15);

//             return (
//               <Card
//                 key={job.job_id}
//                 ref={isLast ? lastJobRef : null}
//                 className="hover:scale-[1.01] transition-transform duration-200"
//               >
//                 <CardContent className="p-6 flex justify-between gap-6">
//                   {/* LEFT */}
//                   <div className="flex-1">
//                     <h2 className="text-xl font-bold">{job.title}</h2>

//                     <p className="text-muted-foreground">{job.company}</p>

//                     <div className="flex items-center gap-2 text-sm mt-1">
//                       <MapPin size={14} />
//                       {job.location}
//                     </div>

//                     {/* SKILLS */}
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {job.skills?.map((s: string) => (
//                         <Badge key={s}>{s}</Badge>
//                       ))}
//                     </div>

//                     {/* DESCRIPTION */}
//                     <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
//                       {job.description}
//                     </p>
//                   </div>

//                   {/* RIGHT */}
//                   <div className="flex flex-col items-end gap-3">
//                     <div className="text-xl font-bold text-primary">
//                       {match}%
//                     </div>

//                     <Button
//                       variant="outline"
//                       onClick={() => setSelectedJob(job)}
//                     >
//                       View
//                     </Button>

//                     <Button
//                       onClick={() => window.open(job.apply_link)}
//                     >
//                       Apply
//                       <ExternalLink size={14} />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* 🔥 JOB MODAL */}
//         {selectedJob && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-background p-6 rounded-lg max-w-2xl w-full space-y-4">
//               <h2 className="text-2xl font-bold">{selectedJob.title}</h2>

//               <p className="text-muted-foreground">
//                 {selectedJob.company} • {selectedJob.location}
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 {selectedJob.skills?.map((s: string) => (
//                   <Badge key={s}>{s}</Badge>
//                 ))}
//               </div>

//               <p className="text-sm whitespace-pre-line">
//                 {selectedJob.description}
//               </p>

//               <div className="flex justify-between">
//                 <Button
//                   variant="outline"
//                   onClick={() => setSelectedJob(null)}
//                 >
//                   Close
//                 </Button>

//                 <Button
//                   onClick={() => window.open(selectedJob.apply_link)}
//                 >
//                   Apply Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </MainLayout>
//   );
// }

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MainLayout } from "@/components/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, ExternalLink, Search } from "lucide-react";
import { getJobs } from "@/lib/api";

// -------------------------------
// 🔥 DEBOUNCE
// -------------------------------
function useDebounce(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

// -------------------------------
// 🔥 CACHE
// -------------------------------
const jobCache = new Map<string, any[]>();

// -------------------------------
// 🔥 SKELETON
// -------------------------------
const SkeletonCard = () => (
  <div className="animate-pulse p-6 border rounded-lg space-y-3">
    <div className="h-6 bg-muted rounded w-1/2"></div>
    <div className="h-4 bg-muted rounded w-1/3"></div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-muted rounded"></div>
      <div className="h-6 w-16 bg-muted rounded"></div>
    </div>
    <div className="h-4 bg-muted rounded w-full"></div>
  </div>
);

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const debouncedSearch = useDebounce(search);
  const debouncedSkill = useDebounce(skill);

  // -------------------------------
  // 🔥 FETCH JOBS
  // -------------------------------
  const fetchJobs = async (reset = false) => {
    const cacheKey = `${page}-${debouncedSearch}-${debouncedSkill}`;

    if (jobCache.has(cacheKey)) {
      const cached = jobCache.get(cacheKey)!;
      setJobs(prev => reset ? cached : [...prev, ...cached]);
      return;
    }

    setLoading(true);

    try {
      const data = await getJobs({
        page,
        search: debouncedSearch,
        skill: debouncedSkill,
      });

      const newJobs = data.jobs || [];

      if (newJobs.length === 0) {
        setHasMore(false);
      }

      jobCache.set(cacheKey, newJobs);

      setJobs(prev => reset ? newJobs : [...prev, ...newJobs]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔄 RESET
  // -------------------------------
  useEffect(() => {
    setPage(1);
    setJobs([]);
    setHasMore(true);
    fetchJobs(true);
  }, [debouncedSearch, debouncedSkill]);

  // -------------------------------
  // 🔄 LOAD MORE
  // -------------------------------
  useEffect(() => {
    if (page > 1) fetchJobs();
  }, [page]);

  // -------------------------------
  // 🔥 INFINITE SCROLL
  // -------------------------------
  const observer = useRef<IntersectionObserver | null>(null);

  const lastJobRef = useCallback(
    (node: any) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold">🚀 Job Board</h1>
          <p className="text-muted-foreground">
            AI-powered job discovery
          </p>
        </div>

        {/* SEARCH */}
        <div className="sticky top-0 z-10 bg-background pb-4 flex gap-4">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            placeholder="Skill filter..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <Button>
            <Search size={16} />
          </Button>
        </div>

        {/* SKELETON */}
        {loading && jobs.length === 0 && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* JOB LIST */}
        <div className="space-y-4">
          {jobs.map((job, index) => {
            const isLast = index === jobs.length - 1;
            const match = Math.min(95, (job.skills?.length || 1) * 15);

            return (
              <Card
                key={`${job.job_id}-${index}`}
                ref={isLast ? lastJobRef : null}
                className="hover:scale-[1.01] transition"
              >
                <CardContent className="p-6 flex justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <p className="text-muted-foreground">{job.company}</p>

                    <div className="flex items-center gap-2 text-sm mt-1">
                      <MapPin size={14} />
                      {job.location}
                    </div>

                    {/* FIXED SKILLS */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[...new Set(job.skills || [])].map((s: string, i: number) => (
                        <Badge key={`${s}-${i}`}>{s}</Badge>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-xl font-bold text-primary">
                      {match}%
                    </div>

                    <Button onClick={() => setSelectedJob(job)} variant="outline">
                      View
                    </Button>

                    <Button onClick={() => window.open(job.apply_link)}>
                      Apply <ExternalLink size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 🔥 LOAD MORE INDICATOR */}
        {loading && jobs.length > 0 && (
          <p className="text-center text-muted-foreground">
            Loading more jobs...
          </p>
        )}

        {/* MODAL */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-2xl w-full space-y-4">
              <h2 className="text-2xl font-bold">{selectedJob.title}</h2>

              <p className="text-muted-foreground">
                {selectedJob.company} • {selectedJob.location}
              </p>

              <div className="flex flex-wrap gap-2">
                {[...new Set(selectedJob.skills || [])].map((s: string, i: number) => (
                  <Badge key={`${s}-${i}`}>{s}</Badge>
                ))}
              </div>

              <p className="text-sm whitespace-pre-line">
                {selectedJob.description}
              </p>

              <div className="flex justify-between">
                <Button onClick={() => setSelectedJob(null)} variant="outline">
                  Close
                </Button>

                <Button onClick={() => window.open(selectedJob.apply_link)}>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}