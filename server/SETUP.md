# Server Setup Instructions

## Environment Variables Required

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# TMDB API Configuration (for fetching movie data)
TMDB_API_KEY=your_tmdb_api_key_here

# Clerk Configuration (for authentication)
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Server Configuration
PORT=3000
```

## Database Setup

1. Make sure MongoDB is running on your system
2. Run the seed script to add sample data:
   ```bash
   cd server
   node seedData.js
   ```

## Running the Server

```bash
cd server
npm install
npm start
```

The server will start on http://localhost:3000
