# Business Nexus - Professional Networking Platform

A full-stack application connecting entrepreneurs and investors with real-time chat, collaboration requests, and profile management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd business-nexus
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp env.example .env
```

Update `.env` with your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/business-nexus
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ..
npm install
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🧪 Testing Guide

### 1. **API Testing with Postman**

**Import this collection to Postman:**

```json
{
  "info": {
    "name": "Business Nexus API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"entrepreneur\",\n  \"location\": \"New York\",\n  \"bio\": \"Test bio\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"sarah@techstartup.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/auth/login"
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/auth/me"
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get Entrepreneurs",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/users/entrepreneurs"
          }
        },
        {
          "name": "Get Investors",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/users/investors"
          }
        }
      ]
    },
    {
      "name": "Profiles",
      "item": [
        {
          "name": "Get My Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/profiles/me"
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"bio\": \"Updated bio\",\n  \"location\": \"Updated location\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/profiles/me"
          }
        }
      ]
    },
    {
      "name": "Requests",
      "item": [
        {
          "name": "Send Request",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"entrepreneurId\": \"entrepreneur-id-here\",\n  \"message\": \"I'm interested in your startup!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/requests"
          }
        },
        {
          "name": "Get My Requests",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/requests"
          }
        }
      ]
    },
    {
      "name": "Chat",
      "item": [
        {
          "name": "Send Message",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"receiverId\": \"user-id-here\",\n  \"content\": \"Hello!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/chat/messages"
          }
        },
        {
          "name": "Get Messages",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/chat/messages/user-id-here"
          }
        }
      ]
    }
  ]
}
```

### 2. **Frontend Testing Steps**

#### **Step 1: Authentication Testing**
1. Open `http://localhost:5173`
2. Click "Sign up" and create a new account
3. Test login with demo credentials:
   - **Entrepreneurs:** sarah@techstartup.com / password123
   - **Investors:** alex@stonecapital.com / password123

#### **Step 2: Dashboard Testing**
1. **Investor Dashboard:**
   - Login as an investor
   - Verify entrepreneurs are displayed
   - Test search and filter functionality
   - Click "Message" or "Request" buttons

2. **Entrepreneur Dashboard:**
   - Login as an entrepreneur
   - Verify collaboration requests are shown
   - Test profile editing

#### **Step 3: Chat Testing**
1. Open two browser windows/tabs
2. Login as different users in each
3. Navigate to chat between users
4. Send messages and verify real-time updates

#### **Step 4: Profile Testing**
1. Go to Profile page
2. Edit profile information
3. Save changes and verify updates

### 3. **Database Testing**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use business-nexus

# View collections
show collections

# Check users
db.users.find()

# Check requests
db.requests.find()

# Check messages
db.messages.find()
```

### 4. **Socket.io Testing**
1. Open browser console
2. Check for socket connection logs
3. Send messages and verify real-time updates
4. Test typing indicators

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy

### Backend Deployment (Railway/Heroku)

#### Railway:
1. Connect GitHub repo to Railway
2. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
3. Deploy

#### Heroku:
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   ```
4. Deploy: `git push heroku main`

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check `CLIENT_URL` in backend `.env`
   - Ensure frontend URL matches

2. **Database Connection:**
   - Verify MongoDB URI is correct
   - Check if MongoDB is running

3. **Socket Connection:**
   - Check browser console for errors
   - Verify token is being sent correctly

4. **Build Errors:**
   - Run `npm install` in both frontend and backend
   - Clear node_modules and reinstall

## 📊 Demo Credentials

**Entrepreneurs:**
- sarah@techstartup.com / password123
- marcus@greentechco.com / password123
- emily@edutechpro.com / password123
- david@fintech.io / password123

**Investors:**
- alex@stonecapital.com / password123
- robert@innovatevc.com / password123
- jennifer@futureventures.com / password123

## 🎯 Features Tested

- ✅ User Authentication (Login/Register)
- ✅ Role-based Dashboards
- ✅ Profile Management
- ✅ Real-time Chat
- ✅ Collaboration Requests
- ✅ Search and Filtering
- ✅ Responsive Design
- ✅ Dark Mode
- ✅ API Integration
- ✅ Socket.io Real-time Communication

## 📝 API Documentation

Full API documentation available at: `http://localhost:5000/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 