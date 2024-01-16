import { randomUUID } from "crypto";

import { Food, Prisma } from "@prisma/client";

import { FoodsRepository } from "../foods-repository";

export class InMemoryFoodsRepository implements FoodsRepository {
  public items: Food[] = [];

  async create(data: Prisma.FoodUncheckedCreateInput) {
    const food: Food = {
      id: randomUUID(),
      name: data.name,
      brand: data.brand,
      description: data.description,
      barcode: data.barcode,
      portionOfFood: data.portionOfFood,
      portionOfFoodUnity: data.portionOfFoodUnity,
      homemadeMeasurement: data.homemadeMeasurement,
      homemadeMeasurementUnity: data.homemadeMeasurementUnity,
      isFavorite: data.isFavorite ?? false,
      userId: data.userId,
      createdAt: new Date(),
    };

    this.items.push(food);

    return food;
  }
}
