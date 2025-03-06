import firebaseAdmin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../google_credentials.json";

const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
});

const auth = admin.auth();

export { auth, admin };
