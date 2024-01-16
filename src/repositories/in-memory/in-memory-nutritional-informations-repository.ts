import { randomUUID } from "crypto";

import { NutritionalInformation, Prisma } from "@prisma/client";

import { NutritionalInformationsRepository } from "../nutritional-informations-repository";

export class InMemoryNutritionalInformationsRepository
  implements NutritionalInformationsRepository
{
  public items: NutritionalInformation[] = [];

  async create(data: Prisma.NutritionalInformationUncheckedCreateInput) {
    const nutritionalInformation: NutritionalInformation = {
      id: randomUUID(),
      calories: data.calories,
      carbohydrates: data.carbohydrates,
      protein: data.protein,
      fat: data.fat,
      monounsaturatedFat: data.monounsaturatedFat,
      saturatedFat: data.saturatedFat,
      polyunsaturatedFat: data.polyunsaturatedFat,
      transFat: data.transFat,
      cholesterol: data.cholesterol,
      sodium: data.sodium,
      potassium: data.potassium,
      fiber: data.fiber,
      sugar: data.sugar,
      calcium: data.calcium,
      iron: data.iron,
      vitaminA: data.vitaminA,
      vitaminC: data.vitaminC,
      foodId: data.foodId,
    };

    this.items.push(nutritionalInformation);

    return nutritionalInformation;
  }
}
