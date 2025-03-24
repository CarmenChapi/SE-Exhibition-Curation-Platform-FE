# 🎨 Exhibition Curation Platform



**Exhibition Curation Platform** is a React.js application that allows users to explore artworks from various museums and universities. Users can view their exhibitions and the saved items within each collection. It includes **Firebase Authentication**, integrates with multiple **artwork APIs**, and provides an excellent experience for searching, creating curation collections and saving artworks.
**MVP**Users can search artworks across collections from different museums or University APIs. Allow users to browse artworks, from a list view, with "Previous" and "Next" page navigation options to prevent loading of too many items at once.
Users can filter and/or sort artworks to make navigating the more extensive list of items easier.
Display images and essential details about each artwork individually.
Enable users to create, add, and remove items from personal exhibition collections of saved artworks. A single user can have multiple exhibition collections.


---

## Link to the deployed version using Firebase Authentication
[![Netlify Status](https://api.netlify.com/api/v1/badges/18dd1137-9cf1-4dcb-912a-f482cff0dead/deploy-status)](https://app.netlify.com/sites/curationplatform/deploys)
#### https://curationplatform.netlify.app/
## Link to the deployed version with a user logged
####   https://userlogincuratorplatorm.netlify.app

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

## 🔧 Installation & Setup to Run the Project Locally

### 1️⃣ **Clone the repository**

#### git clone https://github.com/CarmenChapi/SE-Exhibition-Curation-Platform-FE.git
And move to the main directory
#### cd app-FE 


### 2️⃣ Install dependencies

npm install

### 3️⃣ Set up Firebase
3️⃣ Set up Firebase Authentication
Your app uses Firebase for user sign‑in (Google + Email/Password). Follow these steps to configure it:

1️⃣ Create a Firebase Project
Go to the Firebase Console and click Add project.
Give it a name (e.g. “Exhibition Curation”) and finish the setup.
2️⃣ Enable Authentication Providers
In your project’s sidebar, select Authentication → Sign‑in method
Enable Google and Email/Password, then save.
3️⃣ Copy Your Firebase Config
In Firebase Console navigate to Project settings → General
Under Your apps, copy the configuration object.
4️⃣ Create src/firebase.js
At the root of your project, create a file named src/firebase.js and paste:

---

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, signInWithPopup, signOut };

--- 

🔒 Put  **.env** in **.gitignore** file to no be committed

5️⃣ Add Environment Variables
Create a file called .env in your project root and populate it with the values from your Firebase config:

--- 

VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

---


### 4️⃣ Set up API Keys
Get API keys from the museum APIs and add them to .env:

- Environment variable to add in .env:
#### VITE_API_KEY_SMITHSONIAN="ApikeyValue"
- ApiInfo: 
#### https://github.com/Smithsonian/OpenAccess
- KeyRequest: 
#### https://api.data.gov/signup/

- Environment variable:
#### VITE_API_KEY_EUROPEANA="ApikeyValue"
- ApiInfo: 
#### https://europeana.atlassian.net/wiki/spaces/EF/pages/2462351393/Accessing+the+APIs
- KeyRequest: 
#### https://pro.europeana.eu/pages/get-api

- Environment variable:
#### VITE_API_KEY_HARVARD="ApikeyValue"
- ApiInfo: 
#### https://github.com/harvardartmuseums/api-docs
- KeyRequest: 
#### https://docs.google.com/forms/d/e/1FAIpQLSfkmEBqH76HLMMiCC-GPPnhcvHC9aJS86E32dOd0Z8MpY2rvQ/viewform**

- Environment variable:
#### VITE_API_KEY_RIJKS="ApikeyValue"
- ApiInfo: 
#### https://data.rijksmuseum.nl/docs/api/#access-to-api
- KeyRequest: 
#### Create an account in **https://www.rijksmuseum.nl/nl** and with your account request key


Add in .gitignore file:
#### .env

### 5️⃣ Run the project

#### npm run dev
The app will be available at http://localhost:5173/.

---

## Node version required
v>=18.0.0

## Link to the BackEnd Part of the project
https://se-curator-be.onrender.com/api
https://github.com/CarmenChapi/SE-ExhibitionCurationP-BE.git

## Link to a video, no audio
https://youtube.com/shorts/i8MpB6xUJkQ
