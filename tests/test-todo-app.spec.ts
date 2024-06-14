/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';
import { TodoPage } from './todoPage';

let todoPage: TodoPage;

test.beforeEach(async ({ page }) => {
  todoPage = new TodoPage(page);
  await page.goto('/', { timeout: 50000 });
});

test('Should be able to browse to the To Do App', async ({ page }) => {
  await expect(page).toHaveTitle('Todo List App');
});

test('Should be able to navigate To Do App', async () => {
  await todoPage.assertTodoListHeadingTextEquals('Todo List App');
});

test('Assert number of Todo matches with expected count', async () => {
  await todoPage.isCountTodoItemsEquals(2);
});

test('Should show all the existing Todo lists', async () => {
  await todoPage.assertTextsInElements(['Run the To Do app', 'Write some playwright tests']);
});

test('Should be able perform end to end task on a newly created Todo item', async () => {
  // Add a new Todo item to the list
  await todoPage.addNewTodoItem('New Todo Item');
  await todoPage.isCountTodoItemsEquals(3);

  // Should display the newly added Todo item in the list
  await todoPage.assertTextsInElements(['Run the To Do app', 'Write some playwright tests', 'New Todo Item']);

  // Should be able to check a newly created item
  await todoPage.checkTodoItem('New Todo Item');

  // Should be able to uncheck a newly created item
  await todoPage.uncheckTodoItem('New Todo Item');

  // Should be able to check after an unchecked action completed
  await todoPage.checkTodoItem('New Todo Item');

  // Should be able to remove a newly created item
  await todoPage.removeTodoItem('New Todo Item');

  // Should update the Todo item after a deletion
  await todoPage.assertTextsInElements(['Run the To Do app', 'Write some playwright tests']);
});

test('Should be able to uncheck checked Todo items in the list', async () => {
  await todoPage.uncheckTodoItem('Run the To Do app');
});

test('Should be able to check Todo list item', async () => {
  await todoPage.checkTodoItem('Write some playwright tests');
  await todoPage.expectUncheckedTodoItem('Write some playwright tests');
});

test('Should be able to select All filter radio button', async () => {
  await todoPage.CheckFilterTodosByLabel('All');
  await todoPage.assertFilterTodoByLabelIsChecked('All');
  await todoPage.isCountTodoItemsEquals(2);
  await todoPage.assertTextsInElements(['Run the To Do app', 'Write some playwright tests']);
});

test('Should be able to select Active filter radio button', async () => {
  await todoPage.CheckFilterTodosByLabel('Active');
  await todoPage.assertFilterTodoByLabelIsChecked('Active');
  await todoPage.isCountTodoItemsEquals(1);
  await todoPage.assertTextsInElements(['Write some playwright tests']);
});

test('Should be able to select Completed filter radio button', async () => {
  await todoPage.CheckFilterTodosByLabel('Completed');
  await todoPage.assertFilterTodoByLabelIsChecked('Completed');
  await todoPage.isCountTodoItemsEquals(1);
  await todoPage.assertTextsInElements(['Run the To Do app']);
});

test('Bulk creation, deletion, and filtering', async () => {
  const numberOfRepeats = 26;
  for (let i = 1; i < numberOfRepeats; i++) {
    const count = 2 + i;
    await todoPage.addNewTodoItem('New Todo Item ' + i);
    await todoPage.isCountTodoItemsEquals(count);
  }

  // Should be able to select All filter radio button
  await todoPage.CheckFilterTodosByLabel('All');
  await todoPage.assertFilterTodoByLabelIsChecked('All');
  await todoPage.isCountTodoItemsEquals(27);

  // Should be able to select Completed filter radio button
  await todoPage.CheckFilterTodosByLabel('Completed');
  await todoPage.assertFilterTodoByLabelIsChecked('Completed');
  await todoPage.isCountTodoItemsEquals(1);
  await todoPage.assertTextsInElements(['Run the To Do app']);

  // Should be able to select Active filter radio button
  await todoPage.CheckFilterTodosByLabel('Active');
  await todoPage.assertFilterTodoByLabelIsChecked('Active');
  await todoPage.isCountTodoItemsEquals(26);
});

// TODO - Test Boundary for text field, currently it doesn't have any boundary set.
