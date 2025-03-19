# 🎨 Exhibition Curation Platform

**Exhibition Curation Platform** is a React.js application that allows users to explore artworks from various museums and universities. It includes **Firebase Authentication**, integrates with multiple **artwork APIs**, and provides a great experience for searching and saving artworks.

---

## 🚀 Features

- 🔑 **Firebase Authentication** (Google Sign-In, Email/Password)
- 🎭 **Explore artworks** from museums via APIs (Smithsonian, Artic, Rijksmuseum, etc.)
- 📌 **Save artworks** to private collections
- 🔍 **Search functionality** to find specific pieces
- 📤 **Share artworks** on social media
- 🌍 **Accessible** design

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite, Tailwind CSS)
- **Authentication**: Firebase Auth
- **APIs**:  Artic, Europeana, Harvard Art Institute, The Metropolitan Art Museum, Rijksmuseum, Smithsonian, and Victoria and Albert Museum
- **Routing**: React Router

---

## 🔧 Installation & Setup

### 1️⃣ **Clone the repository**

git clone https://github.com/CarmenChapi/SE-Exhibition-Curation-Platform-FE.git
cd app-FE


2️⃣ Install dependencies

npm install

3️⃣ Set up Firebase
Create a project in Firebase Console
Enable Authentication (Google, Email/Password)
Copy the Firebase config and create a .env file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id


4️⃣ Set up API Keys
Get API keys from the museum APIs and add them to .env:

VITE_API_KEY_SMITHSONIAN="ApikeyValue"
VITE_API_KEY_EUROPEANA="ApikeyValue"
VITE_API_KEY_HARVARD="ApikeyValue"
VITE_API_KEY_RIJKS="ApikeyValue"


Add in .gitignore file
    .env

5️⃣ Run the project

npm run dev
The app will be available at http://localhost:5173/.