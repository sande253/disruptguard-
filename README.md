# disruptguard-

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_8OxUF2mhDsZdvpeHZTC16CWW7LaK)

## Getting Started

### Prerequisites

- Node.js 18+ or compatible runtime
- pnpm (recommended) or npm/yarn
- Mapbox account and API token

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd disruptguard-
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Mapbox token:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

Get your Mapbox token from: https://account.mapbox.com/access-tokens/

### Running the Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
disruptguard-/
├── app/                    # Next.js app directory
│   ├── analytics/         # Analytics dashboard
│   ├── carbon/            # Carbon tracking
│   ├── compare/           # Route comparison tool
│   ├── inventory/         # Inventory management
│   ├── reports/           # Report generation
│   ├── settings/          # Settings page
│   ├── simulation/        # Disruption simulation
│   ├── suppliers/         # Supplier management
│   └── tracking/          # Shipment tracking
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── simulation/        # Simulation components
│   ├── suppliers/         # Supplier components
│   └── ui/                # Reusable UI components (shadcn/ui)
├── contexts/              # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets

```

## Features

- 🗺️ **Interactive Route Mapping**: Visualize supply chain routes across India with Mapbox integration
- 📊 **Risk Analytics**: Real-time risk assessment and forecasting
- 🚚 **Shipment Tracking**: Live tracking of shipments with sensor data
- 🔄 **Route Comparison**: Compare multiple routes side-by-side
- 🤖 **AI Recommendations**: AI-powered decision support
- 📈 **Analytics Dashboard**: Historical data analysis and insights
- 🌱 **Carbon Tracking**: Monitor and optimize CO2 emissions
- 👥 **Supplier Management**: Network visualization and risk scoring

## Tech Stack

- **Framework**: Next.js 16.2.4 with React 19
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 4.2.0
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: Mapbox GL
- **Forms**: React Hook Form + Zod

## Recent Fixes (2026-05-03)

- ✅ Fixed critical runtime error in tracking page (missing useEffect import)
- ✅ Moved Mapbox token to environment variables for security
- ✅ Fixed memory leak in dashboard layout
- ✅ Improved route comparison cost parsing logic

See [CHANGELOG.md](./CHANGELOG.md) for detailed changes.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/sande253/disruptguard-" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
