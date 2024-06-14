// import { assert } from 'assert';
import { Page, expect } from '@playwright/test';
import assert from 'assert';

export class TodoPage {
  private page: Page;

  constructor (page: Page) {
    this.page = page;
  }

  async navigate () {
    try {
      await this.page.goto('/', { timeout: 50000 });
    } catch (error) {
      console.error('Navigation failed: ', error);
    }
  }

  async assertTodoListHeadingTextEquals (pageTitle: string) {
    const title = await this.page.title();
    assert.strictEqual(title, pageTitle);
  }

  async addNewTodoItem (item: string): Promise<void> {
    const inputSelector = "//input[@x-model='newTodo']";
    await this.page.fill(inputSelector, item);
    await this.page.locator(inputSelector).press('Enter');
  }

  async checkTodoItem (text: string) {
    await this.page.locator('li').filter({ hasText: text }).getByTestId('todo-item-complete').check();
  }

  async expectUncheckedTodoItem (text: string) {
    await expect(this.page.locator('li').filter({ hasText: text }).getByTestId('todo-item-complete')).toBeChecked();
  }

  async uncheckTodoItem (text: string) {
    await this.page.locator('li').filter({ hasText: text }).getByTestId('todo-item-complete').uncheck();
  }

  async removeTodoItem (text: string) {
    await this.page.locator('li').filter({ hasText: text }).getByTestId('todo-item-remove').click();
  }

  async CheckFilterTodosByLabel (label: string) {
    await this.page.getByLabel(label).check();
  }

  async assertFilterTodoByLabelIsChecked (label: string) {
    await this.page.getByLabel(label).isChecked();
  }

  async isCountTodoItemsEquals (expectedCount: number) : Promise<void> {
    const todoItems = this.page.locator('//ul[contains(@class, "mt-4")]//li');
    const itemCount = await todoItems.count();

    await assert.equal(itemCount, expectedCount);
  }

  async assertTextsInElements (expectedTexts: string[]): Promise<void> {
    const elements = await this.page.locator('//div[@x-show="!todo.complete"]');
    await expect(elements).toHaveText(expectedTexts);
  }
}
