import firebaseAdmin from "firebase-admin";

const admin: firebaseAdmin.app.App = firebaseAdmin.initializeApp();

const auth: firebaseAdmin.auth.Auth = admin.auth();

export { auth, admin };
