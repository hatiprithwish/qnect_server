import prisma from "../config/prisma.config";
import { User } from "qnect-types";

type UserWhereInput = {
  id?: string;
  email?: string;
  name?: string;
  pid?: number;
};

class UserService {
  static async findUser(where: UserWhereInput): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where,
    });
    return user;
  }
}

export default UserService;
