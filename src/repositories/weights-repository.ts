import { Prisma, Weight } from "@prisma/client";

export interface WeightsRepository {
  create(data: Prisma.WeightUncheckedCreateInput): Promise<Weight>;
}
