import firebaseAdmin from "firebase-admin";

let app;

if (!firebaseAdmin.apps.length) {
  app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = firebaseAdmin.auth();

export { auth, app };
