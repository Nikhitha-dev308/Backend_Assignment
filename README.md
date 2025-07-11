# Admin Dashboard Backend

This is the backend server for the **Admin Dashboard Assignment** built with **Node.js**, **Express**, and **MongoDB**. It provides RESTful APIs to manage user data (Create, Read, Update, Delete). Admin login is handled through a simple mock check for assignment purposes.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Environment Config**: dotenv

## 📋 Features

- 🔐 Mock Admin Login
- 👥 Add new users
- 📝 Edit and update user details
- ❌ Delete users
- 🌐 RESTful API design

## 📁 Project Structure
backend/
├── models/
│ └── User.js # Mongoose schema
├── routes/
│ └── userRoutes.js # User-related endpoints
├── controllers/
│ └── userController.js
├── config/
│ └── db.js # MongoDB connection setup
├── .env # Environment variables
├── server.js # Entry point


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nikhitha-dev308/Backend_Assignment.git
cd admin-dashboard-backend

### 2. Install Dependencies
npm install


### 3.Setup Environment Variables
Create a .env file in the root:
MONGO_URI = "mongodb+srv://nikhithaa308:CnBIa4aocjjFSPPd@cluster0.qqokkzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

### 4. Start the Server
npm run dev

👩‍💻 Author
Nikhitha
This project backend was created individually as part of a full-stack assignment.




