# QuickShow - Movie Booking Platform

A full-stack movie booking application built with React, Node.js, and MongoDB. Users can browse trending movies, view details, book tickets, manage bookings, and add movies to favorites. Admins can manage shows and bookings.

![GoStays Preview](./preview/preview1.png) <!-- Replace with actual screenshot -->

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Keys & Configuration](#api-keys--configuration)
- [Database Setup](#database-setup)
- [Useful Links](#useful-links)

## ✨ Features

### User Features

- **Dynamic Movie Carousel** - Browse trending movies with auto-rotating carousel banner
- **Movie Exploration** - Search and filter movies by genre, rating, and release date
- **Movie Details** - View comprehensive movie information and descriptions
- **Ticket Booking** - Reserve seats with interactive seat layout
- **Payment Processing** - Secure payments via Stripe
- **My Bookings** - Track and manage your bookings
- **Favorites** - Save movies to your favorites list
- **User Authentication** - Secure login via Clerk

### Admin Features

- **Dashboard** - Overview of bookings and shows statistics
- **Manage Shows** - Create and manage movie shows
- **List Shows** - View all active shows
- **View Bookings** - Monitor all user bookings
- **Email Notifications** - Automated booking confirmations

## 🛠 Tech Stack

### Frontend

- **React 19.1.0** - UI library
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **React Router 7.6.1** - Client-side routing
- **Axios 1.11.0** - HTTP client
- **Clerk** - Authentication & user management
- **Lucide React** - Icon library
- **React Player** - Video player
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB** - Database (via Mongoose 8.16.4)
- **Stripe** - Payment processing
- **Clerk** - Authentication
- **Inngest** - Background jobs
- **Nodemailer** - Email service
- **Cloudinary** - Image hosting
- **Svix** - Webhook management

### Development Tools

- **Nodemon** - Auto-restart during development
- **ESLint** - Code linting
- **Vercel** - Deployment platform

## 📁 Project Structure

```
quickShow/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Banner.jsx          # Dynamic movie carousel
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── MovieCard.jsx       # Movie card component
│   │   │   ├── TrailerSection.jsx  # Video trailer display
│   │   │   ├── Footer.jsx          # Footer component
│   │   │   ├── Loader.jsx          # Loading spinner
│   │   │   ├── DateSelect.jsx      # Date picker
│   │   │   ├── FeatureSection.jsx  # Features display
│   │   │   ├── BlurCircle.jsx      # Decorative element
│   │   │   ├── admin/              # Admin components
│   │   │   │   ├── AdminNavbar.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   └── Title.jsx
│   │   │   └── protectedRoutes.jsx # Route protection
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx            # Home page
│   │   │   ├── Movies.jsx          # Movie listing
│   │   │   ├── MovieDetails.jsx    # Movie details
│   │   │   ├── SeatLayout.jsx      # Seat selection
│   │   │   ├── MyBookings.jsx      # User bookings
│   │   │   ├── Favorite.jsx        # Favorites page
│   │   │   └── admin/              # Admin pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Layout.jsx
│   │   │       ├── AddShows.jsx
│   │   │       ├── ListShows.jsx
│   │   │       └── ListBookings.jsx
│   │   ├── appContext/             # React Context
│   │   │   └── AppContext.jsx      # Global state
│   │   ├── assets/                 # Static assets & config
│   │   │   ├── assets.js
│   │   │   └── images/
│   │   ├── lib/                    # Utility functions
│   │   │   ├── dateFormat.js
│   │   │   ├── isoTimeFormat.js
│   │   │   ├── kConverter.js
│   │   │   └── timeFormat.js
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/                     # Public static files
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── vercel.json                 # Vercel deployment config
│   └── .env                        # Environment variables
│
├── server/                         # Backend (Node.js + Express)
│   ├── models/                     # MongoDB schemas
│   │   ├── userModel.js
│   │   ├── movieModel.js
│   │   ├── showModel.js
│   │   └── bookingModel.js
│   ├── controllers/                # Business logic
│   │   ├── userController.js
│   │   ├── movieController.js
│   │   ├── showController.js
│   │   ├── bookingController.js
│   │   ├── adminController.js
│   │   └── stripeWebhook.js
│   ├── routes/                     # API routes
│   │   ├── userRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/                 # Express middleware
│   │   └── auth.js                # Authentication middleware
│   ├── config/                     # Configuration files
│   │   ├── connectDB.js           # MongoDB connection
│   │   └── nodeMailer.js          # Email configuration
│   ├── inngest/                   # Background jobs
│   │   └── index.js
│   ├── server.js                  # Entry point
│   ├── package.json
│   ├── vercel.json                # Vercel deployment config
│   └── .env                       # Environment variables
│
└── README.md                       # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local or Atlas cloud) - [Setup Guide](https://www.mongodb.com/docs/manual/installation/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SR22kl/QuickShow-25.git
cd quickshow
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Copy the environment variables and fill in your API keys

# Start the development server
npm run dev
```

The backend server will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Copy the environment variables and fill in your API keys

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 Environment Variables

### Frontend (.env file in `client/`)

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_BASE_URL=http://localhost:4000
VITE_CURRENCY=₹

# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

### Backend (.env file in `server/`)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quickshow

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (NodeMailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Inngest (Background Jobs)
INNGEST_API_KEY=your_inngest_api_key

# Svix (Webhooks)
SVIX_API_KEY=your_svix_api_key

# App Configuration
PORT=4000
NODE_ENV=development
```

## 🎬 Running the Application

### Development Mode (Both Frontend & Backend)

**Terminal 1 - Start Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**

```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

**Frontend:**

```bash
cd client
npm run build
npm run preview
```

**Backend:**

```bash
cd server
npm start
```

## 🔐 API Keys & Configuration

### 1. **Clerk Authentication**

- Sign up at [clerk.com](https://clerk.com)
- Create a new application
- Get your **Publishable Key** and **Secret Key**
- Enable sign-up and email/password authentication

### 2. **TMDB API Key**

- Visit [themoviedb.org](https://www.themoviedb.org/)
- Create an account and request an API key
- Use it to fetch trending movies and movie data

### 3. **Stripe Payment**

- Create account at [stripe.com](https://stripe.com)
- Get your **Secret Key** and **Publishable Key**
- Set up webhooks for payment events
- Configure webhook endpoints for booking confirmations

### 4. **MongoDB**

- Create account at [mongodb.com](https://www.mongodb.com/)
- Create a cluster
- Get your connection string (URI)
- Replace username and password in connection string

### 5. **Gmail/Email Service**

- Enable 2-factor authentication on your Gmail account
- Generate an [App Password](https://support.google.com/accounts/answer/185833)
- Use the app password in `EMAIL_PASSWORD`

### 6. **Cloudinary (Image Upload)**

- Sign up at [cloudinary.com](https://cloudinary.com/)
- Get your Cloud Name, API Key, and API Secret from the dashboard
- Use for storing movie posters and images

### 7. **Inngest (Background Jobs)**

- Sign up at [inngest.com](https://inngest.com/)
- Create a project and get your API key
- Use for sending emails and background tasks

### 8. **Svix (Webhooks)**

- Sign up at [svix.com](https://svix.com/)
- Create an application for webhook management
- Get your API key

## 💾 Database Setup

### MongoDB Collections

The application uses the following MongoDB collections:

**Users Collection**

```javascript
{
  _id: ObjectId,
  clerkId: String,
  email: String,
  name: String,
  role: String, // "user" or "admin"
  favorites: [ObjectId], // Movie IDs
  createdAt: Date,
  updatedAt: Date
}
```

**Movies Collection**

```javascript
{
  _id: ObjectId,
  tmdbId: Number,
  title: String,
  description: String,
  genres: [String],
  backdropPath: String,
  posterPath: String,
  releaseDate: Date,
  rating: Number,
  runtime: Number
}
```

**Shows Collection**

```javascript
{
  _id: ObjectId,
  movieId: ObjectId,
  screenNumber: Number,
  showTime: String,
  date: Date,
  ticketPrice: Number,
  totalSeats: Number,
  bookedSeats: [Number],
  createdAt: Date
}
```

**Bookings Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  showId: ObjectId,
  movieId: ObjectId,
  seats: [Number],
  totalPrice: Number,
  paymentStatus: String, // "pending", "completed", "failed"
  stripePaymentId: String,
  bookingDate: Date,
  createdAt: Date
}
```

## 📚 Useful Links

### Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/)

### API References

- [TMDB API Docs](https://developer.themoviedb.org/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Clerk API Documentation](https://clerk.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Cloudinary API Docs](https://cloudinary.com/documentation)

### Tools & Services

- [Vercel Deployment](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Postman API Testing](https://www.postman.com/)
- [Git & GitHub](https://docs.github.com)

## 🔧 Development Workflow

### Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature-name`
6. Create a Pull Request

### Code Quality

```bash
# Lint the frontend code
cd client && npm run lint

# Format code (optional)
npm run format
```

## 📝 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend

- `npm run dev` - Start with Nodemon (auto-reload)
- `npm start` - Start production server

## 🐛 Troubleshooting

### Issue: Port 5173 already in use

```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Issue: MongoDB connection failed

- Verify connection string in `.env`
- Check if MongoDB is running
- Ensure IP whitelist includes your IP (MongoDB Atlas)

### Issue: TMDB API not working

- Verify API key is correct and active
- Check API rate limits
- Test with Postman: `https://api.themoviedb.org/3/trending/movie/week?api_key=YOUR_KEY`

### Issue: Stripe payments failing

- Verify Stripe keys (secret vs publishable)
- Check webhook endpoint configuration
- Use test card: 4242 4242 4242 4242 (any future date, any CVC)

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributors

- Your Name - [GitHub](https://github.com/yourprofile)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Coding! 🎬🍿**
