# ITEC116 - React to API Integration Activities

A comprehensive collection of full-stack web applications demonstrating React frontend integration with various backend APIs. This repository showcases progressive learning from basic CRUD operations to advanced authentication and real-time features.

## Project Overview

This repository contains 10+ activities that demonstrate mastery of:
- Frontend development with React & TypeScript
- Backend API development with Node.js & NestJS
- Database integration (MongoDB, PostgreSQL)
- RESTful API design and implementation
- Authentication & Authorization
- State management and UI/UX best practices

## Activities

### Activity 1: To-Do List API + UI
**Tech Stack:** React + NestJS + MongoDB

A full-stack task management application with CRUD operations.

**Features:**
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Real-time task status updates
- Responsive UI with animations (GSAP)
- MongoDB integration
- Swagger API documentation

**Key Learning:**
- RESTful API design
- MongoDB schema design
- React hooks (useState, useEffect)
- Axios for API calls

📁 [View Code](./Activity1)

---

### Activity 2: Notes API + UI
**Tech Stack:** React + TypeScript + NestJS + MongoDB + JWT

A secure note-taking application with user authentication.

**Features:**
- User registration and login
- JWT-based authentication
- Create and manage personal notes
- Protected routes
- Session management
- Animated UI components

**Key Learning:**
- JWT authentication implementation
- Protected API routes
- Context API for state management
- Password hashing with bcrypt
- TypeScript interfaces and types

📁 [View Code](./Activity2)

---

### Activity 3: Bookshelf API + UI
**Tech Stack:** React + Express + REST API

A comprehensive book catalog with filtering and search capabilities.

**Features:**
- Browse books by category
- Search functionality
- Author information
- Dynamic filtering
- Responsive grid layout
- API proxy configuration

**Key Learning:**
- Express.js backend setup
- API routing and middleware
- Client-side filtering
- React Router implementation
- Environment variables management

📁 [View Code](./Activity3)

---

### Activity 4: Weather Proxy API
**Tech Stack:** React + NestJS

[Brief description of Activity 4]

📁 [View Code](./Activity4)

---

### Activity 5: Blog Platform
**Tech Stack:** React + TypeScript + NestJS + MongoDB + JWT

A full-featured blogging platform with authentication and comments.

**Features:**
- User authentication (register/login)
- Create, edit, and delete posts
- Tag-based organization
- Comment system
- User-specific post management
- Rich text content support
- Responsive design

**Key Learning:**
- Advanced authentication flows
- Relational data in MongoDB
- Complex state management
- Form validation
- GSAP animations
- Protected route patterns

📁 [View Code](./Activity5)

---

## Technologies Used

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Axios** - HTTP client
- **GSAP** - Animations
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **NestJS** - Node.js framework
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Swagger** - API documentation

### Development Tools
- **Git** - Version control
- **npm/yarn** - Package management
- **Postman** - API testing
- **MongoDB Compass** - Database GUI
- **VS Code** - Code editor

## Getting Started

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
MongoDB Atlas account (or local MongoDB)
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ITEC116.git
cd ITEC116
```

2. **Choose an activity**
```bash
cd Activity1  # or any activity number
```

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run start:dev
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- Swagger Docs: `http://localhost:3001/api`

## Environment Variables

Each activity requires specific environment variables. Create a `.env` file in the backend directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3001
```

## API Testing

### Using Swagger UI
Navigate to `http://localhost:3001/api` to access interactive API documentation.

### Using Postman
Import the provided Postman collection from each activity's `/docs` folder.

## Learning Outcomes

By completing these activities, you will gain expertise in:

1. **Frontend Development**
   - React component architecture
   - State management patterns
   - TypeScript best practices
   - Responsive design principles
   - Client-side routing

2. **Backend Development**
   - RESTful API design
   - Database modeling
   - Authentication & Authorization
   - Error handling
   - API documentation

3. **Full-Stack Integration**
   - HTTP request/response cycle
   - CORS configuration
   - Environment management
   - Deployment strategies

## Contributing

This is a learning repository. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues
- Suggest improvements

## License

This project is created for educational purposes as part of ITEC116 activity.

## Team Members

- Barba, Rex Symond
- Brocoy, Kenn Harvey
- Dela Torre, Mharbhi Brando
- Grafe
- Marquez, Angelica
- Rontal, Nicole Anne

## Contact

For questions or collaboration:
- Email: ic.mharbhibrando.delatorre@cvsu.edu.ph
- GitHub: [@brandodt](https://github.com/brandodt)

## 🙏 Acknowledgments

- Course Instructor: Vince Dallego
- Institution: Cavite State University [Imus Campus]
- Course: ITEC116 - Web Development

---

### 📊 Progress Tracker

- [x] Activity 1: To-Do List API + UI
- [x] Activity 2: Notes API + UI
- [x] Activity 3: Bookshelf API + UI
- [x] Activity 4: Weather Proxy API
- [x] Activity 5: Blog Platform API + UI
- [ ] Activity 6: Movie Review API + UI
- [ ] Activity 7: Task Management System
- [ ] Activity 8: Chatroom REST API + UI
- [ ] Activity 9: Mini E-Commerce API + UI
- [ ] Activity 10: Event Registration & Ticket QR Scanner

---

**Status:** In Development