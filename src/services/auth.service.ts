import prisma from "../config/prisma.config";
import { auth } from "../config/firebase.config";

class AuthService {
  static async registerUser(email: string, password: string, name: string) {
    const userCredential = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    if (!userCredential) {
      throw new Error("Firebase user registration failed");
    }
    if (!userCredential.email || !userCredential.displayName) {
      throw new Error(`${!userCredential.email ? "Email" : "Name "} is missing in user credential`);
    }

    const emailVerificationToken = await auth.createCustomToken(userCredential.uid);

    await prisma.user.create({
      data: {
        id: userCredential.uid,
        email: userCredential.email,
        name: userCredential.displayName,
      },
    });

    return {
      uid: userCredential.uid,
      email: userCredential.email,
      name: userCredential.displayName,
      emailVerificationToken,
    };
  }
}

export default AuthService;
