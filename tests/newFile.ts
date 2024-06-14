import { test, expect } from '@playwright/test';

test.describe('To-Do Application', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:8080/');
  });

  test('Should be able to browse to the To Do App', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await expect(page).toHaveTitle('Todo List App');
  });

  test('should be able to add a new item to the To Do App', async ({ page }) => {
    const newItem = 'New Task';

    await page.fill('.new-todo', newItem);
    await page.press('.new-todo', 'Enter');

    const todoText = page;
    await expect(todoText).toHaveText('.todo-list li:last-child label', newItem);
  });


});
