# ARESA API Worker

A secure, scalable API built with Cloudflare Workers, providing user authentication, AI-powered analysis services, and credit-based usage tracking.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication with PBKDF2 password hashing
- **🤖 AI Analysis**: Credit-based AI analysis services with usage tracking
- **💰 Credit System**: Built-in credit management with configurable costs
- **📊 Usage Analytics**: Complete analysis history with cost tracking
- **🗃️ Database**: Cloudflare D1 SQLite database with Drizzle ORM
- **🔒 Security**: Middleware-based authentication and authorization
- **⚡ Performance**: Serverless architecture with global edge deployment
- **🔧 TypeScript**: Full type safety with TypeScript

## 🛠️ Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono.js
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with jose library
- **Password Hashing**: PBKDF2 with SHA-256
- **Language**: TypeScript
- **Testing**: Vitest

## 📁 Project Structure

```
aresa-api-worker/
├── src/
│   ├── db/
│   │   ├── drizzle.ts      # Database connection
│   │   └── schema.ts       # Database schema definitions
│   ├── routes/
│   │   ├── auth.ts         # Authentication endpoints
│   │   ├── analysis.ts     # Analysis services
│   │   └── user.ts         # User management
│   ├── utils/
│   │   ├── middleware.ts   # Authentication middleware
│   │   ├── jwt.ts          # JWT utilities
│   │   └── hash.ts         # Password hashing
│   ├── env.ts              # Environment types
│   └── index.ts            # Main application
├── drizzle/                # Database migrations
├── test/                   # Test files
├── wrangler.toml           # Cloudflare Workers config
├── .dev.vars               # Development environment variables
└── package.json
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  credits INTEGER DEFAULT 50,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

### Analysis History Table
```sql
CREATE TABLE analysis_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  credit_cost INTEGER,  -- negative values for deductions
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account with Workers enabled
- Wrangler CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aresa-api-worker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   **For development (.dev.vars):**
   ```bash
   # Generate a secure JWT secret
   openssl rand -hex 32

   # Add to .dev.vars
   echo 'ARESA_AUTH_SECRET="your-generated-secret-here"' > .dev.vars
   ```

4. **Set up Cloudflare D1 Database**

   ```bash
   # Login to Cloudflare
   npx wrangler auth login

   # Create D1 database
   npx wrangler d1 create aresa-db

   # Update wrangler.toml with your database ID
   # The database_id will be shown after creation
   ```

5. **Run database migrations**
   ```bash
   npx wrangler d1 migrations apply aresa-db --local
   ```

## 🏃‍♂️ Development

### Start Development Server

```bash
# Local development with local database
npm run dev

# Local development with remote database
npm run dev -- --remote
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## 🚀 Deployment

### Production Deployment

1. **Set production secrets**
   ```bash
   # Generate a secure secret for production
   openssl rand -hex 32

   # Set the production secret
   npx wrangler secret put ARESA_AUTH_SECRET
   # Paste your generated secret when prompted
   ```

2. **Deploy to production**
   ```bash
   npm run deploy
   ```

### Environment Configuration

**wrangler.toml:**
```toml
name = "aresa-api-worker"
main = "src/index.ts"
compatibility_date = "2025-12-10"

[[d1_databases]]
binding = "DB"
database_name = "aresa-db"
database_id = "your-database-id-here"
migrations_dir = "drizzle"

[observability]
enabled = true
```

## 📡 API Endpoints

### Base API Worker URL (`https://aresa-api-worker.rio-rasyid23.workers.dev`)

### Authentication Routes (`/auth`)

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "credits": 50
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "credits": 50
  }
}
```

### Analysis Routes (`/analysis`)

#### Perform Analysis
```http
POST /analysis
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "prompt": "Analyze this text for sentiment",
  "output": "This is a positive sentiment analysis result"
}
```

**Response:**
```json
{
  "output": "This is a positive sentiment analysis result",
  "creditsDeducted": 10,
  "creditsRemaining": 40
}
```

**Error Response (Insufficient Credits):**
```json
{
  "error": "Insufficient credits. Required: 10, Available: 5"
}
```

#### Get Analysis History
```http
GET /analysis/history
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "history-uuid",
    "userId": "user-uuid",
    "inputText": "Analyze this text",
    "outputText": "Analysis result",
    "creditCost": -10,
    "createdAt": 1765434894
  }
]
```

### User Routes (`/user`)

#### Delete User Account
```http
DELETE /user
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "password": "currentpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User account and all associated data deleted successfully",
  "deletedUser": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ARESA_AUTH_SECRET` | JWT signing secret (32+ bytes recommended) | Yes |
| `DB` | D1 database binding (auto-configured) | Yes |

### Cost Configuration

Current analysis cost: **10 credits per analysis**

To modify the cost, update the `creditsRequired` constant in `src/routes/analysis.ts`:

```typescript
const creditsRequired = 10; // Change this value
```

## 🔒 Security Features

- **Password Security**: PBKDF2 hashing with 100,000 iterations
- **JWT Tokens**: HMAC-SHA256 signed with configurable expiration (7 days)
- **Input Validation**: Email format validation and required field checks
- **Credit Protection**: Prevents negative credit balances
- **Authentication Middleware**: Centralized auth logic for all protected routes

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Coverage

Tests include:
- Authentication endpoints
- Analysis credit deduction
- User management
- Middleware functionality
- Error handling

## 📊 Credit System

### Default Credits
- **New users**: 50 credits
- **Analysis cost**: 10 credits per request

### Credit Tracking
- All analysis operations are recorded in `analysis_history`
- Negative `creditCost` values indicate deductions
- Real-time credit balance updates
- Insufficient credit protection

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm test` | Run test suite |
| `npm run cf-typegen` | Generate Cloudflare types |

## 🚨 Error Handling

### Common Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient credits |
| 404 | Not Found | User or resource not found |
| 500 | Internal Server Error | Server-side error |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Cloudflare Workers documentation
- Review the Drizzle ORM documentation

## 🎯 Roadmap

- [ ] Rate limiting implementation
- [ ] API versioning
- [ ] Admin dashboard
- [ ] Bulk analysis operations
- [ ] Credit purchase system
- [ ] Usage analytics dashboard

---

**Built with ❤️ using Cloudflare Workers, Hono, and Drizzle ORM**

