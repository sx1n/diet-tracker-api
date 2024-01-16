import { NutritionalInformation, Prisma } from "@prisma/client";

export interface NutritionalInformationsRepository {
  create(
    data: Prisma.NutritionalInformationUncheckedCreateInput,
  ): Promise<NutritionalInformation>;
}
