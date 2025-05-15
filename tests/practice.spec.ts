import { test, expect } from '@playwright/test';

test.describe('PRACTICE', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('link', { name: 'Start Learning' })).toBeVisible();
    await page.getByRole('link', { name: 'Start Learning' }).click();
    await page.waitForURL('**/learn');
    await expect(page.getByRole('link', { name: 'Practice 5 Challenge 2: Query' })).toBeVisible();
    await page.getByRole('link', { name: 'Practice 16 Challenge 8:' }).click();
    await page.waitForURL('**/learn/16');
    await expect(page.getByText('Practice')).toBeVisible();
  });

  test.describe('Unhappy Path', () => {
    test('should show failed evaluation when too slow', async ({ page }) => {
      // Enter initial query
      await page.getByRole('textbox', { name: 'Select Query' }).click();
      await page.getByRole('textbox', { name: 'Select Query' }).fill(selectQuery);
      await page.getByRole('button', { name: 'Evaluate' }).click();

      // Expect failure
      await expect(page.getByText('Failed')).toBeVisible();
      await expect(page.getByLabel('Evaluation')).toContainText('Query returned expected data');
      await expect(page.getByLabel('Evaluation')).toContainText('Query performance is insufficient');
    });
  });

  test.describe('Happy Path', () => {
    test('should pass evaluation after adding index preparation query', async ({ page }) => {
      // Re-enter and prepare query
      await page.getByRole('textbox', { name: 'Select Query' }).click();
      await page.getByRole('textbox', { name: 'Select Query' }).press('ControlOrMeta+a');
      await page.getByRole('textbox', { name: 'Select Query' }).fill(selectQuery);
      await page.getByRole('textbox', { name: 'Preparation Query' }).click();
      await page.getByRole('textbox', { name: 'Preparation Query' }).fill(preparationQuery);
      await page.getByRole('button', { name: 'Evaluate' }).click();

      // Expect success
      await expect(page.getByText('Passed')).toBeVisible();
      await expect(page.getByLabel('Evaluation')).toContainText('Query returned expected data');
      await expect(page.getByLabel('Evaluation')).toContainText('Query performance is sufficient');
    });
  });
});

const preparationQuery = 'CREATE INDEX IF NOT EXISTS idx_employee_last_name_gin ON employee USING gin (last_name gin_trgm_ops);';
const selectQuery = 'SELECT first_name, last_name, birth_date FROM employee WHERE last_name LIKE \'%ith%\' AND hire_date = \'1989-06-14\' ORDER BY last_name, first_name;';
