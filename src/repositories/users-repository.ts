import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}
