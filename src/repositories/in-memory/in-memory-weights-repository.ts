import { randomUUID } from "crypto";

import { Prisma, Weight } from "@prisma/client";

import { WeightsRepository } from "../weights-repository";

export class InMemoryWeightsRepository implements WeightsRepository {
  public items: Weight[] = [];

  async create(data: Prisma.WeightUncheckedCreateInput) {
    const weight: Weight = {
      id: randomUUID(),
      value: data.value,
      date: data.date ? new Date(data.date) : new Date(),
      userId: data.userId,
    };

    this.items.push(weight);

    return weight;
  }
}
