import admin from "firebase-admin";
import config from "config";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    privateKey: config.FIREBASE_PRIVATE_KEY,
  }),
});

export default admin.auth;
