#  CodeWise – AI-Powered Code Editor

**CodeWise** is a web-based code editor designed to help users write, analyze, understand, and correct code using AI. Built as a final year project, it combines a clean user interface with powerful AI assistance for beginner and intermediate developers.

---

##  Features

-  AI Integration with OpenAI (Analyze, Explain, Fix code)
-  Save & retrieve code snippets (MongoDB backend)
-  Real-time syntax highlighting with Monaco Editor
-  Dark / Light theme toggle with persistence
-  JWT-based authentication (Login/Register)
-  Dashboard to view past codes

---

## 🛠️ Technologies Used

### Frontend:
- React.js
- Tailwind CSS
- @monaco-editor/react
- Framer Motion
- Axios
- React Toastify

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- OpenAI GPT API Integration

---

##  Getting Started

###  Clone the Repository

```bash
git clone https://github.com/Cakirov/codewise
cd codewise
```

 Backend Setup

cd backend
npm install
Create a .env file in the backend/ directory:


MONGO_URI=mongodb://localhost:27017/codewise
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
Then run:

npm run dev


Frontend Setup

```bash
cd ../frontend
npm install
npm start
```
Then open your browser and go to:
http://localhost:3000



📌 Requirements
Node.js (v18+)

MongoDB (local or cloud)

OpenAI API Key