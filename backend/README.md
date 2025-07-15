# Business Nexus Backend API

A comprehensive backend API for the Business Nexus networking platform that connects entrepreneurs and investors.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Separate profiles for entrepreneurs and investors
- **Collaboration Requests**: Send, accept, reject investment requests
- **Real-time Chat**: Socket.io powered messaging system
- **Search & Filtering**: Advanced filtering for users and requests
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.io
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database (running locally on mongodb://localhost:27017)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   The `.env` file is already configured with your local MongoDB connection string.

3. **Seed the database**:
   ```bash
   npm run seed
   ```

4. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Update password

### Users
- `GET /api/users/entrepreneurs` - Get all entrepreneurs (investors only)
- `GET /api/users/investors` - Get all investors (entrepreneurs only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/stats/dashboard` - Get dashboard statistics

### Profiles
- `GET /api/profiles/me` - Get current user profile
- `PUT /api/profiles/me` - Update current user profile
- `GET /api/profiles/:id` - Get user profile by ID
- `POST /api/profiles/avatar` - Update profile avatar

### Collaboration Requests
- `POST /api/requests` - Send collaboration request (investors only)
- `GET /api/requests` - Get user's requests
- `PATCH /api/requests/:id` - Update request status (entrepreneurs only)
- `GET /api/requests/:id` - Get request by ID
- `DELETE /api/requests/:id` - Delete request (investors only)

### Chat
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/:userId` - Get messages with user
- `GET /api/chat/conversations` - Get user's conversations
- `PATCH /api/chat/messages/:userId/read` - Mark messages as read
- `GET /api/chat/unread-count` - Get unread message count

### Health Check
- `GET /api/health` - API health status

## Socket.io Events

### Client to Server
- `joinChat` - Join a chat room
- `leaveChat` - Leave a chat room
- `sendMessage` - Send a message
- `typing` - Send typing indicator
- `getOnlineStatus` - Get online status of users

### Server to Client
- `newMessage` - Receive new message
- `messageNotification` - Message notification
- `newRequest` - New collaboration request
- `requestUpdate` - Request status update
- `userTyping` - User typing indicator
- `userOnline` - User came online
- `userOffline` - User went offline
- `onlineStatus` - Online status response

## Database Models

### User
- Basic info: name, email, password, role, avatar, bio, location
- Entrepreneur fields: startup, industry, fundingNeeded, pitchSummary, stage, teamSize, website, linkedin
- Investor fields: company, investmentRange, industries, portfolio, twitter

### Request
- investor, entrepreneur (ObjectId refs)
- status: pending/accepted/rejected
- message, responseMessage
- timestamps

### Message
- sender, receiver (ObjectId refs)
- content, read status, messageType
- timestamps

## Demo Credentials

After running the seed script, you can use these credentials:

**Entrepreneurs:**
- sarah@techstartup.com / password123
- marcus@greentechco.com / password123
- emily@edutechpro.com / password123
- david@fintech.io / password123

**Investors:**
- alex@stonecapital.com / password123
- robert@innovatevc.com / password123
- jennifer@futureventures.com / password123

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Role-based access control

## Error Handling

The API includes comprehensive error handling:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- 404 errors for missing resources

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Project Structure
```
backend/
├── config/          # Database configuration
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── socket/          # Socket.io handlers
├── .env             # Environment variables
├── .gitignore       # Git ignore rules
├── package.json     # Dependencies and scripts
├── README.md        # Documentation
└── server.js        # Main server file
```

## Deployment

The backend is ready for deployment to platforms like:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

Make sure to:
1. Set environment variables in your deployment platform
2. Update CORS settings for your frontend domain
3. Use a production MongoDB database
4. Set NODE_ENV to 'production'

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details