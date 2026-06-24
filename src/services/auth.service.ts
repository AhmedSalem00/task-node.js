import bcrypt from "bcrypt";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";

const SALT_ROUNDS = 12;

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export const authService = {
  async register({ name, email, password }: RegisterParams) {
    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Role is always assigned server-side; clients cannot elect their own role.
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "member",
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user: user.toSafeJSON(), token };
  },

  async login({ email, password }: LoginParams) {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user: user.toSafeJSON(), token };
  },
};
