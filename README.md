# 🚀 Ignite Curiosity AI - Interactive Educational Platform

An advanced educational platform that combines AI with interactive learning for children. The system enables creating dynamic lessons with simulated child responses and an intelligent AI instructor.

## 🎯 **What the System Does**

- **Interactive Lessons** with AI instructor
- **Simulated Child Responses** with unique personality for each child
- **Group Chat Interface** with smooth scrolling
- **Dynamic Lesson Step Management**
- **Real-time Progress Tracking**

## 🏗️ **Architecture**

### **Frontend (Client)**
- **React 18** + **TypeScript**
- **Vite** - Fast build tool
- **Tailwind CSS** - Modern styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client

### **Backend (Server)**
- **Node.js** + **Express**
- **MongoDB** + **Mongoose** - Database
- **CORS** - Cross-origin requests
- **REST API** - Communication

### **Database**
- **MongoDB** - NoSQL database
- **Collections**: Lessons, Children, Messages

## 📁 **Project Structure**

```
ignite-curiosity-ai/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # React Components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── LessonInterface.tsx
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── ParticipantList.tsx
│   │   │   └── ChatMessage.tsx
│   │   ├── pages/         # Page Components
│   │   │   ├── Index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── services/      # API Services
│   │   │   └── api.ts
│   │   ├── types/         # TypeScript Types
│   │   │   └── lesson.ts
│   │   ├── hooks/         # Custom Hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/           # Utilities
│   │   │   └── utils.ts
│   │   ├── App.tsx        # Main App Component
│   │   ├── main.tsx       # Entry Point
│   │   └── index.css      # Global Styles
│   ├── public/            # Static Assets
│   ├── package.json       # Dependencies
│   ├── tailwind.config.ts # Tailwind Configuration
│   └── vite.config.ts     # Vite Configuration
├── server/                # Backend Application
│   ├── models/            # MongoDB Models
│   │   ├── Lesson.js
│   │   ├── Child.js
│   │   └── Message.js
│   ├── routes/            # API Routes
│   │   └── api.js
│   ├── index.js           # Server Entry Point
│   ├── seed.js            # Database Seeding
│   └── package.json       # Dependencies
└── README.md              # This File
```

## 🚀 **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Step 1: Clone the Project**
```bash
git clone <repository-url>
cd ignite-curiosity-ai
```

### **Step 2: Install Dependencies**
```bash
# Install Client dependencies
cd client
npm install

# Install Server dependencies
cd ../server
npm install
```

### **Step 3: Database Setup**
1. **Local MongoDB:**
   ```bash
   # Run MongoDB
   mongod
   ```

2. **Or MongoDB Atlas:**
   - Create a cluster in Atlas
   - Copy the connection string

### **Step 4: Seed Initial Data**
```bash
cd server
node seed.js
```

### **Step 5: Run the Server**
```bash
# Terminal 1
cd server
npx nodemon index.js
```

### **Step 6: Run the Client**
```bash
# Terminal 2
cd client
npm run dev
```

### **Step 7: Access the System**
- **Client**: http://localhost:8080 (or the displayed port)
- **Server API**: http://localhost:4000

## 🔧 **API Endpoints**

### **Lessons**
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get specific lesson

### **Children**
- `GET /api/children` - Get all children

### **Messages**
- `GET /api/messages/:lessonId` - Get messages for a lesson
- `POST /api/messages` - Add new message

### **Health Check**
- `GET /api/health` - Server health check

## 🎨 **Features**

### **Advanced User Interface**
- **Responsive Design** - Works on all devices
- **Real-time Chat** - Group chat in real-time
- **Interactive Buttons** - Interactive buttons
- **Progress Tracking** - Lesson progress tracking

### **Smart Simulation**
- **AI Teacher** - AI instructor that responds dynamically
- **Child Personalities** - Each child with unique personality
- **Dynamic Responses** - Context-aware responses

### **Lesson Management**
- **Step-by-step Progress** - Progress step by step
- **Time Management** - Time management for each step
- **Session Management** - Lesson session management

## 🛠️ **Development**

### **Available Scripts**

**Client:**
```bash
npm run dev          # Run development server
npm run build        # Build production build
npm run preview      # Preview production build
npm run lint         # Check code quality
```

**Server:**
```bash
npx nodemon index.js # Run server with auto-reload
node seed.js         # Seed initial data
```

### **Environment Variables**

**Server (.env):**
```env
MONGO_URL=mongodb://localhost:27017/ignite-curiosity
PORT=4000
```

## 🤝 **Contributing**

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 📞 **Contact**

- **Email**: [your-email@example.com]
- **GitHub**: [your-github-username]

---

**Made with ❤️ for educational innovation** 