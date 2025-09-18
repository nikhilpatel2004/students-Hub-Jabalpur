# 🏠 Student Hub Jabalpur

A hyperlocal platform that connects **students**, **room/PG owners**, and **tiffin service providers** in **Jabalpur**.  
Say goodbye to messy WhatsApp groups — find rooms, food, and connections in one place.

---

## ✨ Features

- 👨‍🎓 **Student Profiles** — set budget, college, and food preferences.  
- 🏠 **Room Listings** — owners can post rooms with rent, amenities, and photos.  
- 🍱 **Tiffin Listings** — providers can showcase menus, prices, and delivery areas.  
- 🔍 **Smart Search & Filters** — find exactly what you need (price, location, food type).  
- 💬 **In-app Chat** — connect directly with owners/providers (no WhatsApp needed).  
- ⭐ **Reviews & Ratings** — trusted feedback for rooms and tiffins.  
- 📍 **Map Integration** — see listings on Google Maps.  
- 📢 **Requirement Posts** — students can post “Need PG near XYZ under ₹4000” → providers reply.  

---

## 🏗️ Tech Stack

- **Frontend:** React / Next.js + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Atlas) / PostgreSQL (Supabase)  
- **Auth:** JWT + Email/Phone OTP  
- **Storage:** AWS S3 / Supabase Storage  
- **Maps & Geo:** Google Maps API  
- **Hosting:** Vercel (frontend) + Render/Railway (backend)  

---

## 📂 Project Setup

### 1️⃣ Clone repo
```bash
git clone https://github.com/your-username/student-hub-jabalpur.git
cd student-hub-jabalpur
cd backend
npm install
cp .env.example .env   # add MongoDB URI, JWT secret, API keys
npm run dev

# Backend
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/studenthub
JWT_SECRET=supersecret
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key



---

⚡ This version is **clean, short, GitHub-friendly** — with badges & detailed setup optional.  

Do you want me to also **add GitHub badges** (build status, license, stars, etc.) at the top for a more professional repo look?
