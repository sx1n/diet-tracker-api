import { Food, Prisma } from "@prisma/client";

export interface FoodsRepository {
  create(data: Prisma.FoodUncheckedCreateInput): Promise<Food>;
}
