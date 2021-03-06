import { CarRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarRepositoryInMemory;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
  });

  test('Should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'any_description',
      daily_rate: 110.0,
      license_plate: 'JPP-5050',
      fine_amount: 50.0,
      brand: 'any_brand',
      category_id: 'any_category',
    });
    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  test('Should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      description: 'any_description',
      daily_rate: 110.0,
      license_plate: 'JPP-5050',
      fine_amount: 50.0,
      brand: 'another_any_brand',
      category_id: 'any_category',
    });
    const cars = await listAvailableCarsUseCase.execute({
      brand: 'another_any_ brand',
    });

    expect(cars).toEqual([car]);
  });

  test('Should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'any_description',
      daily_rate: 110.0,
      license_plate: 'JPP-5051',
      fine_amount: 50.0,
      brand: 'another_any_brand',
      category_id: 'any_category',
    });
    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car3',
    });

    expect(cars).toEqual([car]);
  });

  test('Should be able to list all available cars by category_id', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'any_description',
      daily_rate: 110.0,
      license_plate: 'JPP-5051',
      fine_amount: 50.0,
      brand: 'another_any_brand',
      category_id: 'any_category',
    });
    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'any_category',
    });

    expect(cars).toEqual([car]);
  });
});
