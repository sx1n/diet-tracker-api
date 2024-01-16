import { FoodsRepository } from "@/repositories/foods-repository";
import { NutritionalInformationsRepository } from "@/repositories/nutritional-informations-repository";

import { InvalidUnitMeasureError } from "./errors/invalid-unit-measure-error";

interface NutritionalInformation {
  calories?: number;
  carbohydrates?: number;
  protein?: number;
  fat?: number;
  monounsaturatedFat?: number;
  saturatedFat?: number;
  polyunsaturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  potassium?: number;
  fiber?: number;
  sugar?: number;
  calcium?: number;
  iron?: number;
  vitaminA?: number;
  vitaminC?: number;
}

interface PortionInfo {
  portionOfFood?: number;
  portionOfFoodUnity?: string;
  homemadeMeasurement?: number;
  homemadeMeasurementUnity?: string;
}

interface CreateFoodUseCaseRequest {
  userId: string;
  name: string;
  brand?: string;
  description?: string;
  barcode?: string;
  nutritionalInformation?: NutritionalInformation;
  portionInfo?: PortionInfo;
  isFavorite?: boolean;
}

export class CreateFoodUseCase {
  constructor(
    private foodsRepository: FoodsRepository,
    private nutritionalInformationsRepository: NutritionalInformationsRepository,
  ) {}

  async execute({
    userId,
    name,
    brand,
    description,
    barcode,
    nutritionalInformation,
    portionInfo,
    isFavorite,
  }: CreateFoodUseCaseRequest): Promise<void> {
    const portionOfFoodUnits = ["ml", "g"];

    const hasPortionOfFood =
      portionInfo?.portionOfFood &&
      portionOfFoodUnits?.includes(portionInfo?.portionOfFoodUnity);

    const hasHomemadeMeasurement =
      portionInfo?.homemadeMeasurement && portionInfo?.homemadeMeasurementUnity;

    if (!hasPortionOfFood || !hasHomemadeMeasurement) {
      throw new InvalidUnitMeasureError();
    }

    const food = await this.foodsRepository.create({
      name,
      brand,
      description,
      barcode,
      isFavorite,
      userId,
    });

    if (nutritionalInformation) {
      await this.nutritionalInformationsRepository.create({
        foodId: food.id,
        ...nutritionalInformation,
      });
    }
  }
}
