# Platinum Sound Studios - Recording Studio Management System

A comprehensive studio management system for Platinum Sound Studios, featuring client management, booking scheduling, invoicing, and analytics.

## Features

- **Dashboard**: Real-time overview of studio operations
- **Booking Management**: Create and manage studio bookings
- **Client Management**: Track clients and their projects
- **Invoice System**: Generate and track invoices
- **Schedule View**: Visual studio schedule calendar
- **Staff Management**: Manage engineers and staff
- **Analytics**: Revenue charts and business insights
- **Client Check-In**: Public page for clients to check in for sessions
- **Authentication**: Secure login for staff members

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Radix UI + Custom components
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd platinum-sound
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/platinum_sound"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

- **Admin**: admin@platinumsound.com / admin123
- **Manager**: manager@platinumsound.com / manager123

## Project Structure

```
platinum-sound/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── bookings/     # Bookings CRUD
│   │   ├── check-in/     # Check-in endpoint
│   │   ├── clients/      # Clients CRUD
│   │   ├── dashboard/    # Dashboard data
│   │   └── invoices/     # Invoices CRUD
│   ├── check-in/         # Public check-in page
│   ├── dashboard/        # Protected dashboard
│   │   ├── analytics/    # Analytics page
│   │   ├── bookings/     # Bookings management
│   │   ├── clients/      # Client management
│   │   ├── invoices/     # Invoice management
│   │   ├── schedule/     # Studio schedule
│   │   ├── settings/     # Settings page
│   │   └── staff/        # Staff management
│   ├── login/            # Login page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   ├── auth-provider.tsx # Auth context provider
│   ├── error-boundary.tsx # Error boundary
│   ├── skeletons.tsx     # Loading skeletons
│   └── theme-toggle.tsx  # Dark mode toggle
├── hooks/
│   └── use-toast.ts      # Toast hook
├── lib/
│   ├── data.ts           # Mock data and types
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/
│   ├── robots.txt        # SEO robots
│   └── sitemap.xml       # SEO sitemap
├── tests/
│   ├── api/              # API tests
│   ├── helpers/          # Test helpers
│   └── public/           # E2E tests
└── .github/workflows/    # CI/CD pipeline
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:ci` - Run tests in CI mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### Authentication
- `POST /api/auth/callback/credentials` - Login

### Bookings
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create booking

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Check-In
- `POST /api/check-in` - Check in with booking code

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t platinum-sound .
docker run -p 3000:3000 platinum-sound
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
