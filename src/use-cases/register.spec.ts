import { compare } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryHeightsRepository } from "@/repositories/in-memory/in-memory-heights-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryWeightsRepository } from "@/repositories/in-memory/in-memory-weights-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository;
let weightsRepository: InMemoryWeightsRepository;
let heightsRepository: InMemoryHeightsRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    weightsRepository = new InMemoryWeightsRepository();
    heightsRepository = new InMemoryHeightsRepository();
    sut = new RegisterUseCase(
      usersRepository,
      weightsRepository,
      heightsRepository,
    );
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      firstname: "John",
      lastname: "Doe",
      sex: "M",
      currentHeight: 175,
      currentWeight: 70.5,
      physicalActivityLevel: "Moderate",
      weightGoal: 65.0,
      birthdate: new Date("1990-05-15"),
      email: "john.doe@example.com",
      password: "secretpassword",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      firstname: "John",
      lastname: "Doe",
      sex: "M",
      currentHeight: 175,
      currentWeight: 70.5,
      physicalActivityLevel: "Moderate",
      weightGoal: 65.0,
      birthdate: new Date("1990-05-15"),
      email: "john.doe@example.com",
      password: "secretpassword",
    });

    const isPasswordCorrectlyHashed = await compare(
      "secretpassword",
      user.passwordHash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "john.doe@example.com";

    await sut.execute({
      firstname: "John",
      lastname: "Doe",
      sex: "M",
      currentHeight: 175,
      currentWeight: 70.5,
      physicalActivityLevel: "Moderate",
      weightGoal: 65.0,
      birthdate: new Date("1990-05-15"),
      email,
      password: "secretpassword",
    });

    await expect(() =>
      sut.execute({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 175,
        currentWeight: 70.5,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email,
        password: "secretpassword",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
