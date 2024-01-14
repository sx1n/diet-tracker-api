import { DateProvider } from "@/providers/DateProvider";
import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";

import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  user: User;
  bmi: number;
  bmiClassification: string;
  bmr: number;
  bmrWithActivity: number;
  bmrUnity: string;
}

export class GetUserProfileUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private dateProvider: DateProvider,
  ) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const heightInMeters = user.currentHeight / 100;

    const bmi = parseFloat(
      (user.currentWeight / heightInMeters ** 2).toFixed(1),
    );

    let bmiClassification: string;

    if (bmi <= 18.5) {
      bmiClassification = "Abaixo do peso";
    } else if (bmi >= 18.6 && bmi <= 24.9) {
      bmiClassification = "Peso normal";
    } else if (bmi >= 25 && bmi <= 29.9) {
      bmiClassification = "Sobrepeso";
    } else if (bmi >= 30 && bmi <= 34.9) {
      bmiClassification = "Obesidade grau I";
    } else if (bmi >= 35 && bmi <= 39.9) {
      bmiClassification = "Obesidade grau II";
    } else if (bmi >= 40) {
      bmiClassification = "Obesidade grau III";
    }

    const physicalActivityLevelRatings = {
      Sedentary: 1.2,
      "Not very active": 1.375,
      Moderate: 1.55,
      "Very active": 1.725,
      Extreme: 1.9,
    };

    const userAge = this.dateProvider.compareInYears(
      user.birthdate,
      this.dateProvider.now(),
    );

    const bmrWithoutActivity =
      user.sex === "M"
        ? 66.5 +
          13.75 * user.currentWeight +
          5.003 * user.currentHeight -
          6.755 * userAge
        : 655.1 +
          9.563 * user.currentWeight +
          1.85 * user.currentHeight -
          4.676 * userAge;

    const bmrWithActivity =
      bmrWithoutActivity *
      physicalActivityLevelRatings[user.physicalActivityLevel];

    return {
      user,
      bmi,
      bmiClassification,
      bmr: parseInt(bmrWithoutActivity.toString()),
      bmrWithActivity: parseInt(bmrWithActivity.toString()),
      bmrUnity: "kcal",
    };
  }
}
