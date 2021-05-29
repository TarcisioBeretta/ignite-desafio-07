import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to consult an user profile", async () => {
    const user = {
      name: "User Test",
      email: "user@mail.com",
      password: "123456"
    };

    const createdUser = await createUserUseCase.execute(user);
    const userProfile = await showUserProfileUseCase.execute(createdUser.id || "654879756");

    expect(userProfile).toHaveProperty("id");
  });

  it("Should not be able to consult a nomexistent user profile", async () => {
    expect(async () => {
      const userProfile = await showUserProfileUseCase.execute("6548135468");
    }).rejects.toBeInstanceOf(AppError);
  });
});
