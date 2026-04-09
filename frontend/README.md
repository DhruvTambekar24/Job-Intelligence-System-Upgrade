# SkillSight - AI Career Development Platform

SkillSight is a modern SaaS application that helps professionals discover their next career move through AI-powered skill recommendations, job matching, and market trend analysis.

## Features

- **Dashboard**: Overview of your career progress with key metrics and visualizations
- **Skill Recommendations**: AI-powered suggestions based on market demand and your profile
- **Market Trends**: Real-time analysis of job market trends and salary information
- **Smart Job Board**: Jobs matched to your skills with compatibility scores
- **Skill Relations**: Understand how skills connect and complement each other
- **Settings**: Manage your profile, notifications, and security preferences

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom theme tokens
- **UI Components**: shadcn/ui
- **Data Visualization**: Recharts
- **Theme Management**: next-themes
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd skillsight
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── dashboard/              # Dashboard page with charts
├── recommendations/        # Skill recommendations page
├── trends/                # Market trends analysis
├── jobs/                  # Job board with matching
├── skills/               # Skill relationships
├── settings/            # User settings
└── layout.tsx          # Root layout with theme provider

components/
├── app-sidebar.tsx      # Navigation sidebar
├── top-navbar.tsx       # Top navigation bar
├── main-layout.tsx      # Shared layout wrapper
├── stats-card.tsx       # Stats display card
├── skeleton-loader.tsx  # Loading states
├── empty-state.tsx      # Empty state component
└── ui/                  # shadcn/ui components

lib/
└── mock-data.ts        # Mock data for development
```

## Color System

The app uses a modern dark theme with the following colors:

- **Primary**: Purple/Blue (`oklch(0.65 0.15 262)`)
- **Accent**: Secondary Purple (`oklch(0.68 0.16 262)`)
- **Background**: Deep Black (`oklch(0.1 0 0)`)
- **Card**: Slightly Lighter Black (`oklch(0.16 0 0)`)
- **Muted**: Mid Gray (`oklch(0.28 0 0)`)

## Key Components

### AppSidebar
Collapsible navigation sidebar with mobile responsiveness. Features:
- Active route highlighting
- Mobile-friendly toggle
- Smooth animations

### TopNavbar
Sticky top navigation with search and theme toggle. Features:
- Search functionality
- Dark/light mode toggle
- Responsive design

### Charts
Interactive data visualizations using Recharts:
- Line charts for trends
- Bar charts for comparisons
- Area charts for market trends

## Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly interface

## Animations

Custom animations for enhanced UX:
- `animate-fade-in-up`: Smooth entry from bottom
- `animate-fade-in`: Fade in effect
- `animate-slide-in`: Slide in from left
- `animate-glow`: Subtle pulsing effect

## Dark Mode

The app features a sophisticated dark mode by default, supporting both dark and light themes via next-themes.

## Mock Data

The application uses mock data for development. To integrate real data:

1. Replace mock-data in `/lib/mock-data.ts`
2. Connect to your backend API
3. Update data fetching in page components

## Deployment

To deploy to Vercel:

```bash
pnpm build
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Development

### Adding New Pages

1. Create a new folder in `app/`
2. Add `page.tsx` with the page component
3. Wrap with `MainLayout` for consistent navigation
4. Add route to sidebar in `components/app-sidebar.tsx`

### Adding New Components

1. Create component in `components/`
2. Import and use in pages
3. Keep components focused and reusable

### Styling

- Use Tailwind CSS classes
- Follow the semantic design token pattern
- Reference CSS variables for colors: `bg-primary`, `text-foreground`, etc.

## Performance Optimization

- Server-side rendering for pages
- Image optimization
- CSS-in-JS with Tailwind
- Efficient chart rendering with Recharts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication and profiles
- Real API integration
- Job application tracking
- Learning path recommendations
- Personalized notifications
- Export functionality

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
