import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to autheticate", async () => {
    await usersRepository.create({
      firstname: "John",
      lastname: "Doe",
      sex: "M",
      currentHeight: 175,
      currentWeight: 70.5,
      physicalActivityLevel: "Moderate",
      weightGoal: 65.0,
      birthdate: new Date("1990-05-15"),
      email: "john.doe@example.com",
      passwordHash: await hash("secretpassword", 6),
    });

    const { user } = await sut.execute({
      email: "john.doe@example.com",
      password: "secretpassword",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "secretpassword",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      firstname: "John",
      lastname: "Doe",
      sex: "M",
      currentHeight: 175,
      currentWeight: 70.5,
      physicalActivityLevel: "Moderate",
      weightGoal: 65.0,
      birthdate: new Date("1990-05-15"),
      email: "john.doe@example.com",
      passwordHash: await hash("secretpassword", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john.doe@example.com",
        password: "wrongpassword",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
