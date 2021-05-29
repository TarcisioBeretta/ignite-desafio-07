import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Get Balance", () => {

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  });

  it("Should be able to consult a user balance", async () => {
    const user = {
      name: "User Test",
      email: "user@mail.com",
      password: "123456"
    };

    const createdUser = await createUserUseCase.execute(user);

    const statement = {
      user_id: createdUser.id || "",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "statement test",
    };

    await createStatementUseCase.execute(statement);

    const balance = await getBalanceUseCase.execute({ user_id: createdUser.id as string });

    expect(balance).toHaveProperty("balance");
  });

  it("Should not be able to consult a nomexistent user balance", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "AS654D" });
    }).rejects.toBeInstanceOf(AppError);
  });
});
