import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryFoodsRepository } from "@/repositories/in-memory/in-memory-foods-repository";
import { InMemoryNutritionalInformationsRepository } from "@/repositories/in-memory/in-memory-nutritional-informations-repository";

import { CreateFoodUseCase } from "./create-food";
import { InvalidUnitMeasureError } from "./errors/invalid-unit-measure-error";

let foodsRepository: InMemoryFoodsRepository;
let nutritionalInformationsRepository: InMemoryNutritionalInformationsRepository;
let sut: CreateFoodUseCase;

describe("Create Food Use Case", () => {
  beforeEach(() => {
    foodsRepository = new InMemoryFoodsRepository();
    nutritionalInformationsRepository =
      new InMemoryNutritionalInformationsRepository();
    sut = new CreateFoodUseCase(
      foodsRepository,
      nutritionalInformationsRepository,
    );
  });

  it("should be able to create food", async () => {
    const foodRequest = {
      userId: "123",
      name: "Maçã",
      brand: "Marca X",
      description: "Uma deliciosa maçã",
      barcode: "123456789",
      nutritionalInformation: {
        calories: 52,
        carbohydrates: 14,
        protein: 0.3,
        fat: 0.2,
        fiber: 2.4,
        sugar: 10.4,
        vitaminC: 0.5,
      },
      portionInfo: {
        portionOfFood: 50,
        portionOfFoodUnity: "g",
        homemadeMeasurement: 2,
        homemadeMeasurementUnity: "units",
      },
      isFavorite: false,
    };

    await sut.execute(foodRequest);
  });

  it("should not be able to create food", async () => {
    const invalidFoodRequest = {
      userId: "123",
      name: "Maçã",
      brand: "Marca X",
      description: "Uma deliciosa maçã",
      barcode: "123456789",
      nutritionalInformation: {
        calories: 52,
        carbohydrates: 14,
        protein: 0.3,
        fat: 0.2,
        fiber: 2.4,
        sugar: 10.4,
        vitaminC: 0.5,
      },
      isFavorite: false,
    };

    await expect(() => sut.execute(invalidFoodRequest)).rejects.toBeInstanceOf(
      InvalidUnitMeasureError,
    );
  });
});
