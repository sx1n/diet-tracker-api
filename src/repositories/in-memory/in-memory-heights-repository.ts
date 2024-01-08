import { randomUUID } from "crypto";

import { Height, Prisma } from "@prisma/client";

import { HeightsRepository } from "../heights-repository";

export class InMemoryHeightsRepository implements HeightsRepository {
  public items: Height[] = [];

  async create(data: Prisma.WeightUncheckedCreateInput) {
    const height: Height = {
      id: randomUUID(),
      value: data.value,
      date: data.date ? new Date(data.date) : new Date(),
      userId: data.userId,
    };

    this.items.push(height);

    return height;
  }
}
