export const skillsData = [
  { id: 1, name: 'React', level: 85, growth: '+12%', trend: 'up' },
  { id: 2, name: 'TypeScript', level: 78, growth: '+8%', trend: 'up' },
  { id: 3, name: 'Node.js', level: 72, growth: '+5%', trend: 'up' },
  { id: 4, name: 'AI/ML', level: 45, growth: '+25%', trend: 'up' },
  { id: 5, name: 'DevOps', level: 60, growth: '+15%', trend: 'up' },
]

export const recommendationsData = [
  {
    id: 1,
    skill: 'Python',
    reason: 'High demand in AI/ML roles',
    relevance: 92,
    action: 'Start Learning',
  },
  {
    id: 2,
    skill: 'AWS Solutions Architect',
    reason: 'Complements your DevOps skills',
    relevance: 88,
    action: 'Learn More',
  },
  {
    id: 3,
    skill: 'GraphQL',
    reason: 'Emerging tech for backend development',
    relevance: 75,
    action: 'Explore',
  },
  {
    id: 4,
    skill: 'Kubernetes',
    reason: 'Essential for cloud-native architecture',
    relevance: 82,
    action: 'Learn More',
  },
]

export const trendsData = [
  { month: 'Jan', aiJobs: 2400, webJobs: 2210, cloudJobs: 2290 },
  { month: 'Feb', aiJobs: 3200, webJobs: 1290, cloudJobs: 2000 },
  { month: 'Mar', aiJobs: 2800, webJobs: 9800, cloudJobs: 2290 },
  { month: 'Apr', aiJobs: 3900, webJobs: 3908, cloudJobs: 2000 },
  { month: 'May', aiJobs: 4800, webJobs: 4800, cloudJobs: 2181 },
  { month: 'Jun', aiJobs: 5200, webJobs: 3800, cloudJobs: 2500 },
]

export const jobsData = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'Remote',
    match: 92,
    salary: '$140k - $180k',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'San Francisco, CA',
    match: 78,
    salary: '$120k - $160k',
    skills: ['React', 'Node.js', 'AWS'],
  },
  {
    id: 3,
    title: 'AI/ML Engineer',
    company: 'DataViz Inc',
    location: 'Remote',
    match: 65,
    salary: '$150k - $200k',
    skills: ['Python', 'AI/ML', 'TensorFlow'],
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudBase',
    location: 'New York, NY',
    match: 85,
    salary: '$130k - $170k',
    skills: ['Kubernetes', 'AWS', 'DevOps'],
  },
]

export const skillRelationsData = [
  {
    source: 'React',
    target: 'JavaScript',
    strength: 95,
  },
  {
    source: 'React',
    target: 'Node.js',
    strength: 80,
  },
  {
    source: 'React',
    target: 'TypeScript',
    strength: 85,
  },
  {
    source: 'Node.js',
    target: 'Express',
    strength: 90,
  },
  {
    source: 'TypeScript',
    target: 'JavaScript',
    strength: 95,
  },
  {
    source: 'Python',
    target: 'AI/ML',
    strength: 92,
  },
  {
    source: 'AI/ML',
    target: 'TensorFlow',
    strength: 88,
  },
  {
    source: 'AWS',
    target: 'DevOps',
    strength: 85,
  },
  {
    source: 'Kubernetes',
    target: 'DevOps',
    strength: 87,
  },
]

export const dashboardStatsData = [
  {
    title: 'Skills Mastered',
    value: '8',
    change: '+2 this month',
    icon: 'trending-up',
  },
  {
    title: 'Matching Jobs',
    value: '234',
    change: '+45 this week',
    icon: 'briefcase',
  },
  {
    title: 'Learning Streak',
    value: '28 days',
    change: 'Keep it up!',
    icon: 'flame',
  },
  {
    title: 'Career Score',
    value: '87/100',
    change: '+5 points',
    icon: 'award',
  },
]
