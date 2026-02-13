# 🚀 Setup Instructions - Other Computer

## Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages (React, Vite, React Router, Lucide icons, etc.)

### 2. Run the Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000/`

### 3. Access from Other Devices (Optional)
If you want to access from other devices on the same Wi-Fi:
```bash
npm run dev -- --host
```

This will show network URLs like:
- Local: `http://localhost:3000/`
- Network: `http://YOUR_IP:3000/`

## Quick Start Commands

```bash
# Install dependencies (first time only)
npm install

# Run development server
npm run dev

# Run with network access
npm run dev -- --host

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### If you get "command not found: npm"
Install Node.js from: https://nodejs.org/

### If port 3000 is already in use
The server will automatically use a different port (like 3001, 3002, etc.)

### If you see dependency errors
Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Project Structure
```
examHelper/
├── src/
│   ├── components/     # React components
│   ├── data/          # Data files (timeline, concepts, compositions)
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## Available Routes
- `/` - Home page
- `/timeline` - Timeline of events and composers
- `/flashcards` - Concept flashcards
- `/compositions` - Compositions and listening list

---

**בהצלחה! 🎵**

