// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBR6BrrR2GGRqpYprNOQV6qK0PF7aGfF3c", // From "Web API Key" in screenshot
  authDomain: "applisting-fa0c3.firebaseapp.com", // Replace YOUR_PROJECT_ID with the Project ID
  projectId: "applisting-fa0c3", // From "Project ID" in screenshot
  storageBucket: "applisting-fa0c3.appspot.com", // Replace YOUR_PROJECT_ID with the Project ID
  messagingSenderId: "497112784383", // From "Project number" in screenshot
  appId: "1:497112784383:android:dda97eb271e3663214dbca", // From the config snippet
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);