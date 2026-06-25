
Readme · MD
# 🎨 Curatoria — Exhibition Curation Platform
 
[![Netlify Status](https://api.netlify.com/api/v1/badges/18dd1137-9cf1-4dcb-912a-f482cff0dead/deploy-status)](https://app.netlify.com/sites/curationplatform/deploys)
[![Node >=22.22.3](https://img.shields.io/badge/node-%3E%3D22.22.3-brightgreen)](https://nodejs.org/)
 
**Curatoria** is a React application for exploring and curating artworks from world-class museums and universities. Browse thousands of pieces across six institution APIs, build personal exhibition collections, and manage them with a full CRUD backend — all behind secure Firebase Authentication.
 
🌐 **Live demo:** [curationplatform.netlify.app](https://curationplatform.netlify.app)
 
---
 
## ✨ Features
 
| Feature | Details |
|---|---|
| 🔑 **Authentication** | Google Sign-In and Email/Password via Firebase Auth |
| 🎭 **Multi-museum search** | Query across six institution APIs from one interface |
| 📋 **Browse & paginate** | List view with Previous / Next navigation |
| 🔍 **Filter & sort** | Sort by title or artist; filter to image-only results |
| 📌 **Personal collections** | Create, rename, and delete named exhibition collections |
| 🖼️ **Artwork management** | Add, view details, edit, and remove saved artworks |
| 📤 **Social sharing** | Share individual artworks to social media |
| ♿ **Accessible design** | Built with accessibility in mind |
 
---
 
## 🏛️ Museum APIs
 
Curatoria integrates with the following institutions:
 
- **Art Institute of Chicago** (Artic)
- **Europeana**
- **Harvard Art Museums**
- **The Metropolitan Museum of Art**
- **Smithsonian Institution**
- **Victoria and Albert Museum**
> _Rijksmuseum integration is paused pending API resolution — see [Future Improvements](#-future-improvements)._
 
---
 
## 🛠️ Tech Stack
 
**Frontend:** React (Vite), React Router, CSS  
**Authentication:** Firebase Auth  
**Backend:** Node.js, Express, PostgreSQL — deployed on Supabase & Render  
**Testing:** Vitest, React Testing Library, jest-dom
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js `>= 22.22.3`
- A [Firebase](https://console.firebase.google.com/) project with Google and Email/Password sign-in enabled
- API keys for the museum APIs you want to use (see [API Keys](#4️⃣-api-keys))
---
 
### 1. Clone the repository
 
```bash
git clone https://github.com/CarmenChapi/SE-Exhibition-Curation-Platform-FE.git
cd app-FE
```
 
### 2. Install dependencies
 
```bash
npm install
```
 
### 3. Configure Firebase
 
1. In the [Firebase Console](https://console.firebase.google.com/), create a project and enable **Google** and **Email/Password** sign-in under **Authentication → Sign-in method**.
2. Go to **Project settings → General → Your apps** and copy your config object.
3. Create `src/firebase.js`:
```js
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
 
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASURE_ID,
};
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
 
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase auth persistence could not be enabled:", error);
});
 
const provider = new GoogleAuthProvider();
 
export {
  auth, provider,
  signInWithPopup, signInWithRedirect, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
};
```
 
4. Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```
 
> **Important:** add `.env` to `.gitignore` so secrets are never committed.
 
---
 
### 4. API Keys
 
Add the following environment variables to your `.env` file. Follow the linked docs to request each key.
 
| Museum | Env Variable | Docs | Key Request |
|---|---|---|---|
| Smithsonian | `VITE_API_KEY_SMITHSONIAN` | [OpenAccess](https://github.com/Smithsonian/OpenAccess) | [api.data.gov](https://api.data.gov/signup/) |
| Europeana | `VITE_API_KEY_EUROPEANA` | [Europeana APIs](https://europeana.atlassian.net/wiki/spaces/EF/pages/2462351393/Accessing+the+APIs) | [pro.europeana.eu](https://pro.europeana.eu/pages/get-api) |
| Harvard Art Museums | `VITE_API_KEY_HARVARD` | [API Docs](https://github.com/harvardartmuseums/api-docs) | [Request form](https://docs.google.com/forms/d/e/1FAIpQLSfkmEBqH76HLMMiCC-GPPnhcvHC9aJS86E32dOd0Z8MpY2rvQ/viewform) |
 
> The Artic, MET, and V&A APIs are open and require no key.
 
---
 
### 5. Run the app
 
```bash
npm run dev
```
 
The app will be available at [http://localhost:5173](http://localhost:5173).
 
---
 
## 🧪 Testing
 
Tests use **Vitest**, **React Testing Library**, and **jest-dom**. External services (Firebase, museum APIs, backend) are fully mocked.
 
| Test file | What it covers |
|---|---|
| `ProtectedRoute.test.jsx` | Authenticated, unauthenticated, and loading route states |
| `UserLogin.test.jsx` | Login, registration, validation errors, loading states, auth redirects |
| `HarvardData.test.jsx` | Loading, API results, searching, image filtering, error states |
| `AddToCollectionFromApi.test.jsx` | Loading collections, creating, adding artworks, validation, navigation, errors |
| `ListCollections.test.jsx` | Loading/displaying collections, creating with button or Enter, validation, errors |
| `CollectionCard.test.jsx` | Default preview, actions, navigation, editing, validation, updating, deleting |
 
```bash
# Run all tests in watch mode
npm test
 
# Run the full suite once
npm run test
 
# Run a single test file
npm run test src/components/collections/CollectionCard.test.jsx
 
# Lint and build
npm run lint
npm run build
```
 
![Test output screenshot](src/demo/test.png)
 
---
 
## 🔗 Backend
 
The custom REST API provides CRUD endpoints for managing collections and saved artworks per user.
 
- **Live API:** [se-curator-be.onrender.com/api](https://se-curator-be.onrender.com/api)
- **Repository:** [SE-ExhibitionCurationP-BE](https://github.com/CarmenChapi/SE-ExhibitionCurationP-BE.git)
Stack: Node.js, Express, PostgreSQL — deployed on Supabase and Render.
 
---
 
## 🧩 Technical Challenges
 
![App screenshot](src/demo/main.png)
 
**Firebase Authentication** — implementing both Google Sign-In and email/password flows, handling persistence, and adapting behaviour across desktop and mobile required careful attention to different auth states and redirect strategies.
 
![Login screenshot](src/demo/login.png)
 
**Six different museum APIs** — each returned data in a completely different shape. Building a normalisation layer to extract a consistent set of fields (title, artist, image, description) across all sources was one of the core architectural challenges.
 
![API screenshot](src/demo/apis.png)
 
**Collection UX** — designing a clear, intuitive flow for organising collections, displaying saved artworks, and managing additions and deletions took significant iteration.
 
---
 
## 🔭 Future Improvements
 
- **Rijksmuseum** — restore integration once API issues are resolved
- **Apple Sign-In** — additional auth option for Apple device users
- **Richer saved artwork data** — store date, museum source, original URL, etc.
- **API layer modularisation** — refactor museum adapters for easier maintenance and extension
---


## 📹 Demo Videos
 
### Desktop
 
| Feature | Video |
|---|---|
| User login (Google, email/password, error states) | [![Watch](https://img.youtube.com/vi/ZjW1yP5Uie0/default.jpg)](https://youtu.be/ZjW1yP5Uie0) |
| Browse, sort, and search artworks | [![Watch](https://img.youtube.com/vi/zDxODVLi-gc/default.jpg)](https://youtu.be/zDxODVLi-gc) |
| Search and add to collection | [![Watch](https://img.youtube.com/vi/Kr7c9YcD67Q/default.jpg)](https://youtu.be/Kr7c9YcD67Q) |
| API error handling | [![Watch](https://img.youtube.com/vi/WFQLhBm2pyI/default.jpg)](https://youtu.be/WFQLhBm2pyI) |
| Create, edit, and delete collections | [![Watch](https://img.youtube.com/vi/heovMXPzomA/default.jpg)](https://youtu.be/heovMXPzomA) |
 
### Mobile
 
| Feature | Video |
|---|---|
| Login on mobile | [![Watch](https://img.youtube.com/vi/QELVrxDWrGI/default.jpg)](https://youtube.com/shorts/QELVrxDWrGI?feature=share) |
| Sort, filter, and persist page on refresh | [![Watch](https://img.youtube.com/vi/vLjjBni6aH8/default.jpg)](https://youtube.com/shorts/vLjjBni6aH8?feature=share) |
| Add artworks, manage collections | [![Watch](https://img.youtube.com/vi/TkmpbgFlzcs/default.jpg)](https://youtu.be/TkmpbgFlzcs) |
 