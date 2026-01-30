# GavaNav Monorepo

A full-stack monorepo for a **Government Service Assistant** chat application with NestJS backend and Next.js frontend.

## 🏗️ Project Structure

```
GavaNav/
├── server/           # NestJS Backend
│   ├── prisma/       # Database schema & migrations
│   └── src/
│       ├── agent/    # Chat agent module
│       └── prisma/   # Database service
└── client/           # Next.js Frontend
    └── src/
        ├── app/      # App router pages
        └── components/  # React components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database and apply schema
npx prisma db push

# Start development server
npm run start:dev
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### POST /chat
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "How do I renew my passport?",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "reply": "To renew your passport, you'll need to...",
  "checklist": [
    { "id": "1", "text": "Valid ID", "completed": false },
    { "id": "2", "text": "Passport Photos", "completed": false }
  ],
  "explanation": "The renewal process typically takes 4-6 weeks..."
}
```

### GET /chat/history?userId={userId}
Retrieve chat history for a user.

## 🗄️ Database Schema

Uses SQLite with Prisma ORM:

- **User**: `id`, `phoneNumber`, `createdAt`, `updatedAt`
- **ChatMessage**: `id`, `role`, `content`, `metadata` (JSON), `userId`, `createdAt`
- **ChatSession**: `id`, `title`, `userId`, `createdAt`, `updatedAt`

## 🔧 Configuration

### Backend
- Port: `3001` (configurable via `PORT` env variable)
- AI Agent URL: `http://localhost:8000/chat` (configurable in `agent.service.ts`)

### Frontend
- API URL: `http://localhost:3001` (configurable via `NEXT_PUBLIC_API_URL`)

## 🎨 Features

- **Modern UI**: Glassmorphism design, dark mode, smooth animations
- **Chat Interface**: Real-time message sending with loading states
- **Structured Responses**: Support for text, checklists, and explanations
- **Recent Searches**: Sidebar with conversation history
- **Responsive Design**: Works on desktop and mobile

## 📝 License

MIT
