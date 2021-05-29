import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create statement", () => {

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

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
  });

  it("Should be able to create a statement", async () => {
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

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement).toHaveProperty("id");
  });

  it("Should be able to create a withdraw statement", async () => {
    const user = {
      name: "User Test",
      email: "user@mail.com",
      password: "123456"
    };

    const createdUser = await createUserUseCase.execute(user);

    const depositStatement = {
      user_id: createdUser.id || "",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "statement test",
    };

    const withdrawStatement = {
      user_id: createdUser.id || "",
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "statement test",
    };

    await createStatementUseCase.execute(depositStatement);

    const createdWithdrawStatement = await createStatementUseCase.execute(withdrawStatement);

    expect(createdWithdrawStatement).toHaveProperty("id");
  });

  it("Should not be able to create a statement for a nomexistent user", async () => {
    expect(async () => {
      const statement = {
        user_id: "112333546",
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "statement test",
      };

      const createdStatement = await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create a withdraw statement with insuficient founds", async () => {
    expect(async () => {
      const user = {
        name: "User Test",
        email: "user@mail.com",
        password: "123456"
      };

      const createdUser = await createUserUseCase.execute(user);

      const statement = {
        user_id: createdUser.id || "",
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "statement test",
      };

      const createdStatement = await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(AppError);
  });
});
