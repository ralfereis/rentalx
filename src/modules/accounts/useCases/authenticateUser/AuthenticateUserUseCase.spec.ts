import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';
import { AppError } from '@shared/errors/AppError';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  test('Should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: 'any_driver_license_number',
      email: 'any_email@mail.com',
      password: 'any_password',
      name: 'any_name',
    };

    await createUserUseCase.execute(user);

    const userCreated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userCreated).toHaveProperty('token');
  });

  test('Should not to be able to authenticate a nonexistent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'any_email@mail.com',
        password: 'any_password',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect.'));
  });

  test('Should not to be able to authenticate with incorrect password', async () => {
    const user: ICreateUserDTO = {
      driver_license: 'any_driver_license_number',
      email: 'any_email@mail.com',
      password: 'any_password',
      name: 'any_name',
    };
    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'invalid_password',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect.'));
  });
});
