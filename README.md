# 🌦️ Weatheristic

## Project Overview

Weatheristic is a modern, responsive weather application that provides real-time weather information using a powerful weather API. Get accurate, up-to-date weather data with a sleek and intuitive user interface.

![Project Preview](https://cloud-6b2ippkmm-hack-club-bot.vercel.app/0image.png)

## 🌟 Features

- **Real-Time Weather Data**
  - Current temperature
  - Humidity
  - Wind speed
  - Precipitation
- **Location-Based Forecasting**
  - Search by city
  - Geolocation support
- **Responsive Design**
  - Mobile and desktop friendly

## 🛠 Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📋 Prerequisites

Before installation, ensure you have:
- Node.js (v18.0.0 or later)
- npm (v8.0.0+) or Yarn
- Weather API account
- Git

## 🔧 Comprehensive Installation Guide

### 1. Clone the Repository

```bash
# HTTPS
git clone https://github.com/hridaya423/weatheristic.git

# SSH
git clone git@github.com:hridaya423/weatheristic.git

# Navigate to project directory
cd weatheristic
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using Yarn
yarn install
```

### 3. Weather API Configuration

#### 3.1 Obtain API Key
1. Sign up at your chosen weather API provider
2. Generate an API key
3. Review API documentation for usage limits

#### 3.2 Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# Weather API Configuration
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
```

### 4. Run Development Server

```bash
# Using npm
npm run dev

# Using Yarn
yarn dev
```

🌐 Access the application at: `http://localhost:3000`
