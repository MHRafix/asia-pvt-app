# TravelHub - Travel Agency Application

A modern, world-class travel agency website built with Next.js 16, MongoDB, Mongoose, TailwindCSS, and shadcn/ui components. This scaffold provides a clean, maintainable architecture following industry best practices.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod for schema validation
- **Type Safety**: TypeScript with strict mode
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── destinations/          # Destination API routes
│   │   └── packages/              # Travel package API routes
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   ├── Header.tsx                 # Navigation header
│   ├── Footer.tsx                 # Footer component
│   ├── DestinationCard.tsx        # Destination card component
│   ├── PackageCard.tsx            # Package card component
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── models/                    # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Destination.ts
│   │   ├── TravelPackage.ts
│   │   ├── Booking.ts
│   │   └── Review.ts
│   ├── api/                       # API utilities
│   │   ├── response.ts            # Response formatting
│   │   ├── validators.ts          # Zod validation schemas
│   │   └── middleware.ts          # API middleware
│   ├── types/                     # TypeScript types
│   ├── db.ts                      # MongoDB connection
│   ├── env.ts                     # Environment validation
│   ├── api-client.ts              # API client utility
│   └── helpers.ts                 # Common utilities
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── tailwind.config.ts             # Tailwind configuration
```

## Getting Started

### 1. Clone or Extract the Project

```bash
git clone <repo-url>
cd travel-agency
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your MongoDB URI:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-agency?retryWrites=true&w=majority
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture & Best Practices

### Database Layer

- **Mongoose Schemas**: Strongly typed MongoDB schemas with validation in `lib/models/`
- **Indexes**: Strategic database indexes for performance optimization
- **Connection Pool**: Cached MongoDB connection for serverless environments

### API Layer

- **RESTful Design**: Standard HTTP methods and status codes
- **Response Format**: Consistent `ApiResponse` structure for all endpoints
- **Input Validation**: Zod schemas for request validation in `lib/api/validators.ts`
- **Error Handling**: Centralized error handling middleware in `lib/api/middleware.ts`
- **Type Safety**: Full TypeScript support with interface definitions

### Frontend Layer

- **Component Organization**: Reusable components split by feature
- **Server Components**: Leveraging Next.js 16 RSC for performance
- **TailwindCSS**: Utility-first CSS with design tokens
- **shadcn/ui**: Accessible, composable UI components
- **API Client**: Dedicated `apiClient` utility for data fetching

### Code Quality

- **TypeScript Strict Mode**: Enabled for maximum type safety
- **Validation**: All inputs validated at API level
- **Error Boundaries**: Proper error handling throughout
- **Environment Validation**: Type-safe environment variables with Zod
- **Logging**: Console logging for debugging (structured format)

## API Endpoints

### Destinations

- `GET /api/destinations` - List all destinations (with pagination)
- `POST /api/destinations` - Create new destination (admin only)
- `GET /api/destinations/[id]` - Get specific destination
- `PUT /api/destinations/[id]` - Update destination (admin only)
- `DELETE /api/destinations/[id]` - Delete destination (admin only)

### Travel Packages

- `GET /api/packages` - List all packages (with filters)
- `POST /api/packages` - Create new package (admin only)
- `GET /api/packages/[id]` - Get specific package
- `PUT /api/packages/[id]` - Update package (admin only)
- `DELETE /api/packages/[id]` - Delete package (admin only)

## Database Models

### User
- Email authentication
- Profile information (name, phone, bio, image)

### Destination
- Complete destination information
- Images, highlights, and travel details
- Ratings and review counts

### TravelPackage
- Package details with pricing
- Itinerary support
- Group size limits
- Difficulty levels

### Booking
- User bookings with traveler count
- Booking and payment status tracking
- Special requests support

### Review
- Ratings and reviews for destinations/packages
- User-generated content
- Helpful votes

## Extending the Application

### Adding New API Routes

1. Create route file in `app/api/[resource]/route.ts`
2. Use validation schemas from `lib/api/validators.ts`
3. Implement CRUD operations with proper error handling
4. Return consistent `ApiResponse` structure

### Adding New Models

1. Create schema in `lib/models/ModelName.ts`
2. Export interface for TypeScript
3. Add validation schemas in `lib/api/validators.ts`
4. Create API routes for CRUD operations

### Adding New Components

1. Create component in `components/ComponentName.tsx`
2. Use shadcn/ui components as base
3. Keep components focused and reusable
4. Add proper TypeScript types

## Performance Optimization

- Database indexes on frequently queried fields
- Pagination support for large datasets
- Image optimization with next/image
- API response caching strategies (when needed)
- TypeScript strict mode for compile-time safety

## Security Considerations

- Environment variables validation
- Input validation with Zod schemas
- MongoDB connection pooling
- Error messages don't leak sensitive info
- Ready for authentication middleware integration

## Next Steps to Enhance

1. **Authentication**: Integrate Auth.js for user authentication
2. **Payment Processing**: Add Stripe for payment handling
3. **Image Upload**: Integrate file storage (Vercel Blob/AWS S3)
4. **Admin Dashboard**: Create admin panel for managing content
5. **Reviews & Ratings**: Implement user review system
6. **Email Notifications**: Add email service for bookings
7. **Search & Filtering**: Advanced search capabilities
8. **Deployment**: Deploy to Vercel with MongoDB Atlas

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please refer to the documentation or create an issue in the repository.
# asia-UI
# asia-app
# asia-pvt-app
