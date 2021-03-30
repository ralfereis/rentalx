import { CarRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  test('Should be able to create a new car', async () => {
    await createCarUseCase.execute({
      name: 'any_name',
      description: 'any_description',
      daily_rate: 100,
      license_plate: 'any_plate',
      fine_amount: 60,
      brand: 'any_brand',
      category_id: 'valid_category_id',
    });
  });
});
