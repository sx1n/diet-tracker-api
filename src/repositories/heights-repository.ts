import { Prisma, Height } from "@prisma/client";

export interface HeightsRepository {
  create(data: Prisma.HeightUncheckedCreateInput): Promise<Height>;
}
