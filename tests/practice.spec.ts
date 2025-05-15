import { test, expect } from '@playwright/test';

test.describe('Practice Challenge Component', () => {
  test.beforeEach(async ({ page }) => {
    // Initial navigation to practice challenge
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('link', { name: 'Start Learning' })).toBeVisible();
    await page.getByRole('link', { name: 'Start Learning' }).click();
    await page.waitForURL('**/learn');
    await expect(page.getByRole('link', { name: 'Practice 5 Challenge 2: Query' })).toBeVisible();
    await page.getByRole('link', { name: 'Practice 5 Challenge 2: Query' }).click();
    await page.waitForURL('**/learn/5');
    await expect(page.getByText('Practice')).toBeVisible();
  });

  test.describe('Unhappy Path', () => {
    test('should show failed evaluation when too slow', async ({ page }) => {
      // Enter initial query
      await page.getByRole('textbox', { name: 'Select Query' }).click();
      await page.getByRole('textbox', { name: 'Select Query' }).fill(
        `SELECT e.hire_date, e.first_name, e.last_name, d.dept_name FROM employee AS e JOIN department_employee AS de ON de.employee_id = e.id AND de.from_date = e.hire_date JOIN department AS d ON d.id = de.department_id WHERE e.hire_date BETWEEN '1999-12-31' AND '2000-01-01';`
      );
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
      await page.getByRole('textbox', { name: 'Select Query' }).fill(
        `SELECT e.hire_date, e.first_name, e.last_name, d.dept_name FROM employee AS e JOIN department_employee AS de ON de.employee_id = e.id AND de.from_date = e.hire_date JOIN department AS d ON d.id = de.department_id WHERE e.hire_date BETWEEN '1999-12-31' AND '2000-01-01';`
      );
      await page.getByRole('textbox', { name: 'Preparation Query' }).click();
      await page.getByRole('textbox', { name: 'Preparation Query' }).fill(
        `CREATE INDEX idx_employee_hire_date ON employee (hire_date);`
      );
      await page.getByRole('button', { name: 'Evaluate' }).click();

      // Expect success
      await expect(page.getByText('Passed')).toBeVisible();
      await expect(page.getByLabel('Evaluation')).toContainText('Query returned expected data');
      await expect(page.getByLabel('Evaluation')).toContainText('Query performance is sufficient');
    });
  });
});
