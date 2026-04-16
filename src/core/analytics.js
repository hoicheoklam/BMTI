// js/analytics.js
// ✅ 所有版本号统一为 10.10.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwHPfZ3RVbNl9PBBP9hp8nj_vJjiRZWUw",
  authDomain: "bmti-74eb0.firebaseapp.com",
  projectId: "bmti-74eb0",
  storageBucket: "bmti-74eb0.firebasestorage.app",
  messagingSenderId: "289987698691",
  appId: "1:289987698691:web:069835f77613cad4abae36",
  measurementId: "G-T64ES37HDG",
  databaseURL: "https://bmti-74eb0-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// 1. 初始化 App
const app = initializeApp(firebaseConfig);
// 2. 初始化 Analytics
const analytics = getAnalytics(app);
// 3. 🔥 初始化 Database (这句你刚才漏掉了)
const db = getDatabase(app);

/**
 * Saves user results to Firebase
 * @param {Object} scores - The final score object from scoreManager
 * @param {String} personalityType - The calculated personality title
 */
export const saveUserResult = async (scores, personalityType) => {
    try {
        const resultsRef = ref(db, 'user_results');
        
        const payload = {
            scores: scores,            // e.g., { resilience: 5, aggression: -2, ... }
            type: personalityType,     // e.g., "The Tactical Mastermind"
            createdAt: serverTimestamp(),
            device: navigator.platform // Helps identify if users are mostly on iOS/Android
        };

        await push(resultsRef, payload);
        console.log("📊 Result synced to database successfully.");
    } catch (error) {
        console.error("❌ Analytics Sync Error:", error);
    }
};