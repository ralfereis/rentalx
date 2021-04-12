import dayjs from 'dayjs';

import { CarRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });
  test('Should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'any_name',
      description: 'any_description',
      daily_rate: 100,
      license_plate: 'any_license_plate',
      fine_amount: 40,
      category_id: 'any_category_id',
      brand: 'any_brand',
    });
    const rental = await createRentalUseCase.execute({
      user_id: 'any_user_id',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });
    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  test('Should not be possible to rent a car if the user has an open rental ', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'any_car_id',
      user_id: 'any_user_id',
      expected_return_date: dayAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: 'any_user_id',
        car_id: 'another_car_id',
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(
      new AppError('There is a rental in progress for this user'),
    );
  });

  test('should not be possible to rent a car that is already rented', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'any_car_id',
      user_id: 'any_user_id',
      expected_return_date: dayAdd24Hours,
    });
    await expect(
      createRentalUseCase.execute({
        user_id: 'any_user_id',
        car_id: 'any_car_id',
        expected_return_date: dayAdd24Hours,
      }),
    ).rejects.toEqual(new AppError('Car is unavailable'));
  });

  test('should not be to create a new rental with invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: 'any_user_id',
        car_id: 'any_car_id',
        expected_return_date: dayjs().toDate(),
      }),
    ).rejects.toEqual(new AppError('Invalid return time'));
  });
});
