# Personal Portfolio - MERN Stack Application

A modern, responsive portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Responsive design
- Project showcase
- Skills and experience section
- Contact form
- Blog section
- Admin dashboard for content management

## Project Structure

```
portfolio/
├── client/             # React frontend
├── server/             # Node.js/Express backend
└── README.md          # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a .env file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## Technologies Used

- Frontend:
  - React.js
  - Material-UI
  - Redux Toolkit
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Multer (for file uploads)

## License

MIT 