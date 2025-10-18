# 🎬 Online Movie Ticket Booking Website

Welcome to the **Online Movie Ticket Booking Website**, a modern and responsive web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It allows users to explore movies, view showtimes, and book tickets online with secure authentication and real-time updates.

---

## 🚀 Tech Stack

| Category | Technologies Used |
|-----------|------------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | Clerk |
| **Event Handling / Background Jobs** | Inngest |
| **Hosting** | Vercel (Frontend), (Backend) |

---

## ✨ Features

- 🎞️ Browse all latest and upcoming movies  
- 🎟️ Book and manage movie tickets easily  
- 👤 Secure authentication using **Clerk**  
- ⚡ Real-time updates powered by **Inngest**  
- ☁️ Cloud-based database using **MongoDB Atlas**  
- 📱 Fully responsive and modern UI design  
- 🔍 Search and filter movies efficiently  

---

## 🧩 Installation & Setup Guide

Follow these simple steps to run this project locally 👇

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mainul-16/movie-ticket-booking.git
cd movie-ticket-booking  
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=your_mongodb_atlas_connection
CLERK_API_KEY=your_clerk_api_key
INNGEST_API_KEY=your_inngest_api_key
```

*(Make sure to add `.env` to your `.gitignore` file so it’s hidden on GitHub)*

### 4️⃣ Run the Project

```bash
npm run dev
```

The app will be live at `http://localhost:5173` (if using Vite) or `http://localhost:3000`.

---

## 🗂️ Folder Structure

```
TICKET_BOOKING/
│
├── Project/ # Frontend (React + Vite)
│ ├── src/ # React source code
│ ├── .env # Frontend environment variables
│ ├── index.html
│ ├── package.json
│ ├── vercel.json
│ └── .gitignore
│
├── server/ # Backend (Node.js + Express)
│ ├── configs/ # Configuration files (DB, etc.)
│ ├── inngest/ # Inngest event handlers
│ ├── models/ # Mongoose models
│ ├── node_modules/
│ ├── server.js # Main backend entry file
│ ├── package.json
│ ├── .env # Backend environment variables
│ └── vercel.json
│
├── .gitignore
└── README.md
```

---

## 🔐 How Authentication Works

* **Clerk** handles user registration, login, and session management.
* Once authenticated, users can:

  * View available shows
  * Book tickets
  * Access their dashboard with booking history

---

## ⚡ Background Jobs (Inngest)

* Inngest is used for **asynchronous event handling**, like sending notifications, confirming bookings, or managing delayed tasks.
* It improves performance and reliability for background processes.

---

## ☁️ Database

* **MongoDB Atlas** stores all user, movie, and booking data securely in the cloud.
* The connection string is stored safely in the `.env` file.

---

## 🧠 Future Enhancements

* 💳 Payment gateway integration (Stripe / Razorpay)
* 🗓️ Seat selection with dynamic pricing
* 📢 Email and SMS notifications
* 📊 Admin dashboard for analytics
* 🌙 Dark mode toggle

---

## 📬 Contact

* **Developer:** Md. Mainul Islam
* **GitHub:** [@yourusername](https://github.com/mainul-16)
* **Project Link:** [Movie Ticket Booking](link)

---

⭐ **If you like this project, don’t forget to give it a star on GitHub!** ⭐
