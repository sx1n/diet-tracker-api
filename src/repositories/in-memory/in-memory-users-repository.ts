import { randomUUID } from "node:crypto";

import { Prisma, User } from "@prisma/client";

import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      firstname: data.firstname,
      lastname: data.lastname,
      sex: data.sex,
      physicalActivityLevel: data.physicalActivityLevel,
      weightGoal: data.weightGoal,
      currentHeight: data.currentHeight,
      currentWeight: data.currentWeight,
      birthdate: new Date(data.birthdate),
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
