# Event Management System

A full-stack web application for creating and managing events. Users can create events, attend events, and interact with other attendees through comments.

## Features

- **User Authentication**
  - Register/Login with email and password
  - JWT-based authentication
  - Protected routes for authenticated users

- **Event Management**
  - Create, edit, and delete events
  - Upload event images
  - Set event details (date, time, location, max attendees)
  - Categorize events (conference, workshop, social, etc.)

- **Event Participation**
  - Browse public events without authentication
  - RSVP to events
  - View attending status
  - See list of attendees

- **Interactive Features**
  - Comment on events
  - Share event links
  - Real-time updates using Socket.IO
  - Search and filter events

- **Dashboard**
  - View all events
  - Filter events by date range
  - Filter by category
  - Search events
  - View events you've created
  - View events you're attending

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Axios
- Socket.IO Client
- React Router
- Heroicons
- Date-fns

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.IO
- Cloudinary (Image Upload)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary Account
- Git

### Installation

1. Clone the repository - git clone https://github.com/Kuldeepkushwah06/event-management-frontend.git && git clone https://github.com/Kuldeepkushwah06/event-mangement-backend.git
cd event-management
2. Install backend dependencies - cd backend && npm install

3. Configure Backend Environment Variables
Create a `.env` file in the backend directory:
env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000

4. Install Frontend Dependencies - cd frontend && npm install
5. Configure Frontend Environment Variables
Create a `.env` file in the frontend directory:
env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000



### Running the Application

1. Start the Backend Server
bash
cd backend
npm run dev

2. Start the Frontend Server
bash
cd frontend
npm start



The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events/public` - Get all public events
- `GET /api/events/public/:id` - Get public event details
- `POST /api/events` - Create new event (Auth required)
- `PUT /api/events/:id` - Update event (Auth required)
- `DELETE /api/events/:id` - Delete event (Auth required)
- `POST /api/events/:id/attend` - Attend event (Auth required)
- `POST /api/events/:id/comments` - Add comment (Auth required)

## Deployment

The backend is deployed at: https://event-mangement-backend-219j.onrender.com
The frontend is deployed at: https://eventmanagementkuldeep.netlify.app

