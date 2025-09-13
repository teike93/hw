# Helpdesk Ticketing System

A modern helpdesk ticketing system built with Fastify, React, TypeScript, and PostgreSQL.

## Features

- 🎫 Create, read, update, and delete tickets
- 📝 Add comments to tickets
- 🔍 Filter, search, and sort tickets
- 📱 Responsive design for mobile and desktop
- 🚀 High-performance Fastify backend
- 🎨 Modern React frontend with TypeScript
- 🐘 PostgreSQL database with Prisma ORM
- 🐳 Docker support for easy deployment
- 📚 Auto-generated API documentation

## Tech Stack

### Backend
- **Fastify** - High-performance web framework
- **TypeScript** - Type-safe development
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Robust relational database
- **Vitest** - Fast unit testing

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### DevOps
- **Docker & Docker Compose** - Containerization
- **ESLint & Prettier** - Code formatting and linting

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd helpdesk-ticketing-system
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start with Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL database on port 5432
   - Backend API on port 3000
   - Frontend app on port 5173

4. **Or run manually**
   ```bash
   # Install dependencies
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   
   # Start database (requires Docker)
   docker-compose up -d postgres
   
   # Setup database
   cd backend
   npx prisma migrate dev
   npx prisma generate
   
   # Start backend
   npm run dev
   
   # In another terminal, start frontend
   cd frontend
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/docs

## API Endpoints

### Tickets
- `GET /api/tickets` - Get all tickets (with filtering, sorting, pagination)
- `GET /api/tickets/:id` - Get specific ticket
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Comments
- `POST /api/tickets/:id/comments` - Add comment to ticket
- `GET /api/tickets/:id/comments` - Get ticket comments

## Database Schema

The application uses PostgreSQL with Prisma ORM:

- **Tickets**: Core ticket entity with title, description, status, priority
- **Comments**: Ticket comments and updates
- **Enums**: Status (OPEN, IN_PROGRESS, RESOLVED, CLOSED) and Priority (LOW, MEDIUM, HIGH, CRITICAL)

## Development

### Backend Development
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm test          # Run tests
npm run db:reset  # Reset database
```

### Frontend Development
```bash
cd frontend
npm run dev       # Start development server
npm run build     # Build for production
npm test         # Run tests
npm run lint     # Lint code
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run all tests
npm run test
```

## Deployment

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Build backend: `cd backend && npm run build`
2. Build frontend: `cd frontend && npm run build`
3. Deploy built files to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details.