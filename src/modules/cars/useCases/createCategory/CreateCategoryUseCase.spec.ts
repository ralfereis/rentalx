import { AppError } from '../../../../errors/AppError';
import { CategoriesRepositoryInMemory } from '../../repositories/in-memory/CategoriesRepositoryInMemory';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory,
    );
  });
  test('Should be able to create a new category', async () => {
    const category = {
      name: 'any_valid_name',
      description: 'any_valid_description',
    };
    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description,
    });
    const categoryCreated = await categoriesRepositoryInMemory.findByName(
      category.name,
    );
    expect(categoryCreated).toHaveProperty('id');
  });

  test('Should not to be able to create a new category with the same name', async () => {
    await expect(async () => {
      const category = {
        name: 'any_valid_name',
        description: 'any_valid_description',
      };
      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      });
      await createCategoryUseCase.execute({
        name: category.name,
        description: category.description,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
