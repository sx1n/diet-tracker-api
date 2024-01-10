import { hash } from "bcrypt";

import { HeightsRepository } from "@/repositories/heights-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { WeightsRepository } from "@/repositories/weights-repository";
import { User } from "@prisma/client";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseRequest {
  firstname: string;
  lastname: string;
  sex: string;
  height: number;
  weight: number;
  physicalActivityLevel: string;
  weightGoal: number;
  birthdate: Date;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private weightsRepository: WeightsRepository,
    private heightsRepository: HeightsRepository,
  ) {}

  async execute({
    firstname,
    lastname,
    sex,
    height,
    weight,
    physicalActivityLevel,
    weightGoal,
    birthdate,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 13);

    const user = await this.usersRepository.create({
      firstname,
      lastname,
      sex,
      height,
      weight,
      physicalActivityLevel,
      weightGoal,
      birthdate,
      email,
      passwordHash,
    });

    await this.weightsRepository.create({
      value: weight,
      userId: user.id,
    });

    await this.heightsRepository.create({
      value: height,
      userId: user.id,
    });

    return { user };
  }
}
