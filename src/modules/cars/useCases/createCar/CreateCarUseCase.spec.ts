import { CarRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  test('Should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'any_name',
      description: 'any_description',
      daily_rate: 100,
      license_plate: 'any_plate',
      fine_amount: 60,
      brand: 'any_brand',
      category_id: 'valid_category_id',
    });
    expect(car).toHaveProperty('id');
  });
  test('Should be able to create a car with exists license plate', async () => {
    await createCarUseCase.execute({
      name: 'any_name',
      description: 'any_description',
      daily_rate: 100,
      license_plate: 'any_plate',
      fine_amount: 60,
      brand: 'any_brand',
      category_id: 'valid_category_id',
    });
    await expect(
      createCarUseCase.execute({
        name: 'another_any_name',
        description: 'any_description',
        daily_rate: 100,
        license_plate: 'any_plate',
        fine_amount: 60,
        brand: 'any_brand',
        category_id: 'valid_category_id',
      }),
    ).rejects.toEqual(new AppError('Car already Exists'));
  });
  test('Should be able to create a car available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'another_any_name',
      description: 'any_description',
      daily_rate: 100,
      license_plate: 'any_plate',
      fine_amount: 60,
      brand: 'any_brand',
      category_id: 'valid_category_id',
    });
    expect(car.available).toBe(true);
  });
});
