# Melofi

Melofi is a productivity and relaxation web application designed to help users stay focused with ambient Lofi music, stunning visuals, and integrated productivity tools.

## Features

### 🎵 Music & Soundscapes

- **Curated Lofi tracks** for focus and relaxation.
- **Background ambient sounds** for a calming work environment.
- **Seamless playback** with customizable playlists.

### 📅 Calendar Widget

- **Syncs with Google Calendar** to fetch and display user events.
- **Caches data** for improved performance while ensuring freshness.

### 🔢 Calculator Widget

- **Inline calculator** for quick calculations.
- **Supports percentage operations** with edge case handling (e.g., `(-3)%` and `(-3%)`).

### ⏰ Alarm Widget

- **Allows users to set alarms** that will ring at a specified time.

### 📝 Notes & Writing Tools

- **Built-in text editor** powered by Slate.js.
- **Full-screen mode** with `react-full-screen` support.
- **Rich text formatting** and note organization.

### 📊 User Stats

- **Tracks focused time**, number of notes used, amount of music listened to, and favorite Melofi scene.

### 🔐 Subscription & Premium Features

- **Paid users** gain access to exclusive features via **Stripe-powered subscriptions**.

### 📬 Mailofi (Newsletter)

- **Users can subscribe** via sign-up or through the landing page.
- **Managed using Brevo** (formerly Sendinblue) for email collection and campaigns.

### 💻 Melofi Desktop App _(WIP)_

- **Built with Electron** for cross-platform desktop support.
- **Available exclusively for premium users**. _(Coming Soon)_

## Tech Stack

- **Frontend:** React, Next.js, TypeScript
- **Backend:** Firebase (Authentication, Firestore, Functions)
- **Database:** IndexedDB (`idb` library for local caching)
- **Testing:** Cypress with Firebase Emulator
- **Payment:** Stripe (for subscriptions)
- **Deployment:** Vercel

## Development Setup

### Prerequisites

- **Node.js** (LTS recommended)
- **Firebase CLI**
- **Git**

### Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/melofi.git
cd melofi

# Install dependencies
npm install
```

### Running Locally

```sh
# Start the development server
npm run dev
```

### Running Cypress Tests

```sh
npm run test:e2e
```

## Contributions

Contributions are welcome! Please follow the contribution guidelines and submit a pull request.

## License

**MIT License**

## Contact

For support and inquiries, visit the [Melofi landing page](https://melofi.app/home) or reach out via email.

---

🚀 **Stay focused, stay productive with Melofi!**
