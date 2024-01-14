import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

import { DayjsDateProvider } from "@/providers/implementations/DayjsDateProvider";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile";

let usersRepository: InMemoryUsersRepository;
let dayjsDateProvider: DayjsDateProvider;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    dayjsDateProvider = new DayjsDateProvider();
    sut = new GetUserProfileUseCase(usersRepository, dayjsDateProvider);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      firstname: "John",
      lastname: "Doe",
      sex: "M",
      currentHeight: 170,
      currentWeight: 50,
      physicalActivityLevel: "Moderate",
      weightGoal: 65.0,
      birthdate: new Date("1990-05-15"),
      email: "john.doe@example.com",
      passwordHash: await hash("secretpassword", 6),
    });

    const { user, bmi, bmiClassification, bmr, bmrWithActivity, bmrUnity } =
      await sut.execute({
        userId: createdUser.id,
      });

    expect(user).toEqual(createdUser);
    expect(bmi).toBeLessThanOrEqual(18.5);
    expect(bmiClassification).toEqual("Abaixo do peso");
    expect(bmr).toEqual(1381);
    expect(bmrWithActivity).toEqual(2141);
    expect(bmrUnity).toEqual("kcal");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  describe("BMI Classification", () => {
    it('should return "Abaixo do peso" in bmiClassification property', async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 152,
        currentWeight: 42.65,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmi, bmiClassification } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmi).toBeLessThanOrEqual(18.5);
      expect(bmiClassification).toEqual("Abaixo do peso");
    });

    it('should return "Peso normal" in bmiClassification property', async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 175,
        currentWeight: 65,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmi, bmiClassification } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmi).toBeGreaterThanOrEqual(18.6);
      expect(bmi).toBeLessThanOrEqual(24.9);
      expect(bmiClassification).toEqual("Peso normal");
    });

    it('should return "Sobrepeso" in bmiClassification property', async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 162,
        currentWeight: 66,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmi, bmiClassification } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmi).toBeGreaterThanOrEqual(25.0);
      expect(bmi).toBeLessThanOrEqual(29.9);
      expect(bmiClassification).toEqual("Sobrepeso");
    });

    it('should return "Obesidade grau I" in bmiClassification property', async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 170,
        currentWeight: 98,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmi, bmiClassification } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmi).toBeGreaterThanOrEqual(30);
      expect(bmi).toBeLessThanOrEqual(34.9);
      expect(bmiClassification).toEqual("Obesidade grau I");
    });

    it('should return "Obesidade grau II" in bmiClassification property', async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 175,
        currentWeight: 119,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmi, bmiClassification } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmi).toBeGreaterThanOrEqual(35.0);
      expect(bmi).toBeLessThanOrEqual(39.9);
      expect(bmiClassification).toEqual("Obesidade grau II");
    });

    it('should return "Obesidade grau III" in bmiClassification property', async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 190,
        currentWeight: 144.3,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmi, bmiClassification } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmi).toBeGreaterThanOrEqual(40.0);
      expect(bmiClassification).toEqual("Obesidade grau III");
    });
  });

  describe("BMR", () => {
    it("should calculate BMR male", async () => {
      const createdUser = await usersRepository.create({
        firstname: "John",
        lastname: "Doe",
        sex: "M",
        currentHeight: 175,
        currentWeight: 65,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmr, bmrWithActivity, bmrUnity } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmr).toEqual(1612);
      expect(bmrWithActivity).toEqual(2499);
      expect(bmrUnity).toEqual("kcal");
    });

    it("should calculate BMR female", async () => {
      const createdUser = await usersRepository.create({
        firstname: "Jessica",
        lastname: "Jones",
        sex: "F",
        currentHeight: 175,
        currentWeight: 65,
        physicalActivityLevel: "Moderate",
        weightGoal: 65.0,
        birthdate: new Date("1990-05-15"),
        email: "john.doe@example.com",
        passwordHash: await hash("secretpassword", 6),
      });

      const { bmr, bmrWithActivity, bmrUnity } = await sut.execute({
        userId: createdUser.id,
      });

      expect(bmr).toEqual(1446);
      expect(bmrWithActivity).toEqual(2241);
      expect(bmrUnity).toEqual("kcal");
    });
  });
});
