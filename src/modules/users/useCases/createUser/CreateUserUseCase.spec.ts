import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "User Test",
      email: "user@mail.com",
      password: "123456"
    };

    await createUserUseCase.execute(user);

    const userCreated = await inMemoryUsersRepository.findByEmail(
      user.email
    );

    expect(userCreated).toHaveProperty("id");
  });

  it("Should not be able to create a new user if email exists", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "user@mail.com",
        password: "123456"
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
