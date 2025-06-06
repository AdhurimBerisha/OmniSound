# OmniSound – Music Streaming & Discovery Platform

OmniSound is a modern web application designed to elevate your music experience. It offers powerful streaming, personalized playlists, real-time collaboration, artist insights, and seamless social sharing, making it easy to discover, enjoy, and share music like never before.

## Features

- Stream high-quality music with an intuitive player  
- Create and manage smart, personalized playlists  
- Collaborate with friends in real-time listening sessions  
- Get detailed artist analytics and insights  
- Share tracks and playlists on social media  
- Discover new music tailored to your tastes  

## Tech Stack

- Frontend: React, Zustand for state management, Tailwind CSS  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Authentication: JWT / OAuth (optional)  
- Real-time:  Socket.IO  

## Installation

1. Clone the repository  
    ```bash
    git clone https://github.com/yourusername/omnisound.git
    ```

2. Install dependencies for frontend and backend  
    ```bash
    cd frontend
    npm install

    cd backend
    npm install
    ```

3. Set up environment variables (see below)

4. Run the development servers  
    ```bash
    # Backend
    npm run dev

    # Frontend
    npm run dev
    ```

## Environment Variables

This project requires a few environment variables to run properly.

- For the **backend**, create a `.env` file.  
- For the **frontend**, create a `.env.local` file.

### Backend `.env` variables include:

- `PORT` — server port (e.g., 5000)  
- `MONGODB_URI` — your MongoDB connection string  
- `ADMIN_EMAIL` — admin email address  
- `CLOUDINARY_API_KEY` — Cloudinary API key  
- `CLOUDINARY_API_SECRET` — Cloudinary API secret  
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name  
- `NODE_ENV` — environment mode (`development` or `production`)  
- `CLERK_SECRET_KEY` — Clerk secret key for authentication  

### Frontend `.env.local` variables include:

- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
