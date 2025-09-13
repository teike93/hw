# Helpdesk Ticketing System

A modern, full-stack helpdesk ticketing system built with **Fastify**, **React**, **TypeScript**, and **PostgreSQL**. Features a high-performance backend API with comprehensive validation, responsive frontend with mobile support, and Docker containerization for easy deployment.

## ✨ Features

- 🎫 **Complete CRUD Operations** - Create, read, update, and delete tickets
- 💬 **Comment System** - Add comments and updates to tickets
- 🔍 **Advanced Filtering** - Filter, search, and sort tickets by status, priority, user, or content
- 📄 **Pagination** - Efficient handling of large ticket datasets
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🚀 **High Performance** - Fastify backend with optimized database queries
- 🔐 **Type Safety** - End-to-end TypeScript for better development experience
- 📚 **Auto-generated API Docs** - Swagger/OpenAPI documentation
- 🧪 **Comprehensive Testing** - Unit and integration tests
- 🐳 **Docker Ready** - Complete containerization with Docker Compose

## 🛠 Tech Stack

### Backend
- **[Fastify](https://www.fastify.io/)** - High-performance web framework (2x faster than Express)
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM with type safety
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Zod](https://zod.dev/)** - Runtime type validation
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework

### Frontend
- **[React 19](https://react.dev/)** - Modern UI library with latest features
- **[Vite](https://vitejs.dev/)** - Lightning-fast development server
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[React Query](https://tanstack.com/query)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **[Lucide React](https://lucide.dev/)** - Beautiful SVG icons

### DevOps & Tools
- **[Docker](https://www.docker.com/)** & **[Docker Compose](https://docs.docker.com/compose/)** - Containerization
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code quality and formatting
- **[Nginx](https://nginx.org/)** - Production web server

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Docker & Docker Compose** ([Download](https://www.docker.com/get-started/))
- **Git** ([Download](https://git-scm.com/downloads))

### 🐳 Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd helpdesk-ticketing-system
   ```

2. **Start all services**
   ```bash
   # Production setup
   docker-compose up -d
   
   # Or for development with hot reload
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Access the applications**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/docs
   - **Database**: PostgreSQL on port 5432

### 💻 Manual Development Setup

1. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials if needed
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend (in a new terminal)
   cd frontend
   npm install
   ```

3. **Start database**
   ```bash
   docker-compose up -d postgres
   ```

4. **Setup database schema**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   # Backend (terminal 1)
   cd backend
   npm run dev
   
   # Frontend (terminal 2)
   cd frontend
   npm run dev
   ```

## 📱 Application Overview

### Ticket Management
- **Create Tickets**: Users can create new support tickets with title, description, and priority
- **View Tickets**: List view with filtering, sorting, and pagination
- **Update Tickets**: Modify ticket details and status
- **Delete Tickets**: Remove tickets when resolved
- **Ticket States**: OPEN → IN_PROGRESS → RESOLVED → CLOSED

### Comment System
- Add comments and updates to tickets
- Chronological comment history
- Author attribution for all comments

### Search & Filter
- **Search**: Full-text search across title, description, and user fields
- **Filter by Status**: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **Filter by Priority**: LOW, MEDIUM, HIGH, CRITICAL
- **Sort Options**: By creation date, update date, title, status, or priority
- **Pagination**: Configurable page size (1-100 items)

## 🔌 API Reference

### Base URL
- Development: `http://localhost:3000`
- Documentation: `http://localhost:3000/docs`

### Endpoints

#### Tickets
```http
GET    /api/tickets              # List tickets with filtering/pagination
GET    /api/tickets/{id}         # Get specific ticket
POST   /api/tickets              # Create new ticket
PUT    /api/tickets/{id}         # Update ticket
DELETE /api/tickets/{id}         # Delete ticket
```

#### Comments
```http
GET    /api/tickets/{id}/comments    # Get ticket comments
POST   /api/tickets/{id}/comments    # Add comment to ticket
```

### Query Parameters (GET /api/tickets)
- `page`: Page number (default: 1)
- `limit`: Items per page (1-100, default: 10)
- `sortBy`: Sort field (createdAt, updatedAt, title, status, priority)
- `sortOrder`: Sort direction (asc, desc)
- `status`: Filter by status
- `priority`: Filter by priority
- `search`: Search in title, description, user

### Request/Response Examples

**Create Ticket:**
```json
POST /api/tickets
{
  "title": "Login Issue",
  "description": "Unable to log in with correct credentials",
  "user": "john.doe@company.com",
  "priority": "HIGH"
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "ticketNumber": "TK-ABC123",
  "title": "Login Issue",
  "description": "Unable to log in with correct credentials",
  "user": "john.doe@company.com",
  "status": "OPEN",
  "priority": "HIGH",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z",
  "comments": []
}
```

## 🗄 Database Schema

```sql
-- Tickets table
CREATE TABLE tickets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticketNumber TEXT UNIQUE NOT NULL DEFAULT generate_cuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  user        TEXT NOT NULL,
  status      Status DEFAULT 'OPEN',
  priority    Priority DEFAULT 'MEDIUM',
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content   TEXT NOT NULL,
  author    TEXT NOT NULL,
  ticketId  UUID REFERENCES tickets(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Enums
CREATE TYPE Status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE Priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Test Coverage
- **Backend**: API endpoints, validation schemas, error handling
- **Frontend**: Components, forms, API integration
- **Integration**: End-to-end workflow testing

## 🏗 Development

### Project Structure
```
helpdesk-ticketing-system/
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utilities and helpers
│   │   └── test/           # Test files
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript types
│   └── Dockerfile
├── docker-compose.yml      # Production container setup
├── docker-compose.dev.yml  # Development container setup
└── README.md
```

### Code Quality
- **ESLint**: Consistent code style and error detection
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking across the stack
- **Husky**: Pre-commit hooks for quality assurance

### Performance Optimizations
- **Fastify**: High-performance server framework
- **Database Indexing**: Optimized queries with proper indexes
- **React Query**: Intelligent caching and background updates
- **Code Splitting**: Lazy loading of React components
- **Nginx Compression**: Gzip compression for static assets

## 🚀 Deployment Options

### 1. Docker Compose (Recommended)
```bash
# Clone and start
git clone <repository-url>
cd helpdesk-ticketing-system
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Cloud Platforms

#### Vercel (Frontend) + Railway (Backend + DB)
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Use Railway PostgreSQL addon

#### Docker on AWS/DigitalOcean
1. Push to container registry
2. Deploy using ECS, EKS, or Docker Droplet
3. Use managed PostgreSQL service

### 3. Traditional VPS
```bash
# Build applications
cd backend && npm run build
cd ../frontend && npm run build

# Deploy built files to your server
# Configure nginx/apache for frontend
# Use PM2 for backend process management
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Ensure all tests pass**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Use descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Fastify Documentation](https://www.fastify.io/docs/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

---

**Made with ❤️ using modern web technologies**