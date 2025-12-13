🍬 Sweet Shop Management System

A full-stack Sweet Shop Management System built using Node.js (TypeScript), Express, MongoDB, React, and Tailwind CSS.
The application supports authentication, inventory management, role-based access (Admin/User), and real-time UI updates.

🚀 Features
👤 Authentication

User registration and login

JWT-based authentication

Admin role detection

🍭 Sweets Management

View all sweets

Search sweets by name, category, or price range

Purchase sweets (stock decreases automatically)

Purchase button disabled when stock is 0

Real-time UI updates without full page reload

🛠 Admin Panel

Add new sweets

Edit sweet details

Delete sweets

Restock sweets

Admin-only access enforced via middleware

🎨 Frontend

Responsive UI (mobile, tablet, desktop)

Modern aesthetic using Tailwind CSS

Smooth transitions and subtle animations

Clean state management without unnecessary reloads

🧱 Tech Stack

Frontend

React + TypeScript

Vite

Tailwind CSS

React Router

Backend

Node.js + TypeScript

Express.js

MongoDB + Mongoose

JWT Authentication

Deployment

Backend: Render

Frontend: Vercel


API endpoints designed to be easily testable


🤖 My AI Usage
AI Tools Used

ChatGPT (OpenAI)

How I Used AI

I used ChatGPT as a development assistant, not as an auto-code generator.
Its role was to support thinking, debugging, and UI refinement, while all final decisions and implementations were done by me.

Specifically, I used AI for:

1️⃣ Responsive Layout & UI Improvements

Asked for guidance on making layouts responsive using Tailwind CSS

Refined spacing, typography, and component structure for better UX

Improved visual consistency across Dashboard, Admin Panel, Login, and Register pages

2️⃣ State Management Optimization (Avoiding Full Page Reloads)

Identified an issue where:

Editing, deleting, restocking, or purchasing sweets caused the entire page to reload

Used AI to:

Analyze the problem

Switch from re-fetching the entire list to updating only the affected item in React state

Result:

Faster UI

Better user experience

Cleaner React logic

3️⃣ Conditional UI Behavior (Purchase Button Disable)

Discussed and implemented logic where:

When quantity === 0, the Purchase button becomes disabled

Button text changes to “Out of Stock”

This improved:

UX clarity

Data integrity

Real-world realism

4️⃣ Code Quality & Documentation

Used AI to:

Add meaningful comments

Improve readability

Follow clean coding practices

Ensured code remains:

Maintainable

Easy to explain in interviews

Consistent with SOLID principles

Reflection: How AI Impacted My Workflow

AI significantly accelerated problem-solving and reduced debugging time, especially for:

UI/UX refinement

State management edge cases

Deployment and configuration issues

However:

All architecture decisions, business logic, and final implementations were done by me

AI was used as a learning and productivity enhancer, not a replacement for understanding

Overall, AI helped me:

Think more clearly

Iterate faster

Build a more polished, production-ready project

📌 Future Improvements

Unit & integration tests for frontend

Pagination and sorting

Sales analytics for admin

Image upload for sweets

👨‍💻 Author

Aman Yadav
Full-Stack Developer | React | Node.js | TypeScript | MongoDB
