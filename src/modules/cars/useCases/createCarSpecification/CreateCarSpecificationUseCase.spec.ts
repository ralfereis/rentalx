import { CarRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  test('Should not be able to add a new specification to a non-existent car', async () => {
    const car_id = '1234';
    const specifications_id = ['54321'];
    await expect(
      createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      }),
    ).rejects.toEqual(new AppError('Car does not exists'));
  });

  test('Should be able to add a new specification to a car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'any_name',
      description: 'any_description',
      daily_rate: 100,
      license_plate: 'any_plate',
      fine_amount: 60,
      brand: 'any_brand',
      category_id: 'valid_category_id',
    });
    const specification = await specificationsRepositoryInMemory.create({
      description: 'any_description',
      name: 'any_name_specification',
    });
    const specifications_id = [specification.id];
    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });
    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
});
