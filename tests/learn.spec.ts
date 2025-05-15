import { test, expect } from '@playwright/test';

test.describe('LEARN', () => {
  test.beforeEach(async ({ page }) => {
    // Initial navigation to quiz
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Start Learning' }).click();
    await page.waitForURL('**/learn');
    await expect(page.getByRole('link', { name: 'Learn 4 B-tree Indexes Learn' })).toBeVisible();
    await page.getByRole('link', { name: 'Learn 4 B-tree Indexes Learn' }).click();
    await page.waitForURL('**/learn/4');
    await expect(page.getByText('Learn', { exact: true })).toBeVisible();
  });

  test.describe('Unhappy Path', () => {
    test('should fail quiz and allow retry', async ({ page }) => {
      // Begin quiz
      await page.getByRole('button', { name: 'Begin Quiz' }).click();

      // Question 1: wrong answer
      await expect(page.getByRole('main')).toContainText(
        'Which index type is created by default when you define a PRIMARY KEY constraint?'
      );
      await page.locator('div').filter({ hasText: /^GIN$/ }).click();
      await page.getByRole('button', { name: 'Next Question' }).click();

      // Question 2: correct answer
      await expect(page.getByRole('main')).toContainText(
        'In a B-tree index, what do the leaf nodes typically contain?'
      );
      await page.getByRole('radiogroup')
        .locator('div')
        .filter({ hasText: 'Indexed data and tuple' })
        .click();
      await page.getByRole('button', { name: 'Next Question' }).click();

      // Question 3: correct answer
      await expect(page.getByRole('main')).toContainText(
        'Why is the B-tree index the default choice in PostgreSQL?'
      );
      await page.getByRole('radiogroup')
        .locator('div')
        .filter({ hasText: 'It efficiently supports a' })
        .click();
      await page.getByRole('button', { name: 'Next Question' }).click();

      // Question 4: correct answer
      await expect(page.getByRole('main')).toContainText(
        'Are indexes automatically created for foreign keys?'
      );
      await page.getByText('No, indexes are not created').click();
      await page.getByRole('button', { name: 'See Results' }).click();

      // Results: expect failure
      await expect(page.getByText('Quiz Results')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('3 / 4');
      await expect(page.getByText('Failed')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('Try again to improve your score.');

      // Retry button visible and restarts quiz
      await page.getByRole('button', { name: 'Restart Quiz' }).click();
      await page.getByRole('button', { name: 'Begin Quiz' }).click();
      await expect(page.getByRole('main')).toContainText(
        'Which index type is created by default when you define a PRIMARY KEY constraint?'
      );
    });
  });

  test.describe('Happy Path', () => {
    test('should complete quiz with all correct answers', async ({ page }) => {
      // Begin quiz
      await page.getByRole('button', { name: 'Begin Quiz' }).click();

      // Question 1: correct answer
      await expect(page.getByRole('main')).toContainText(
        'Which index type is created by default when you define a PRIMARY KEY constraint?'
      );
      await page.locator('div').filter({ hasText: /^B-tree$/ }).click();
      await page.getByRole('button', { name: 'Next Question' }).click();

      // Question 2: correct answer
      await expect(page.getByRole('main')).toContainText(
        'In a B-tree index, what do the leaf nodes typically contain?'
      );
      await page.getByRole('radiogroup')
        .locator('div')
        .filter({ hasText: 'Indexed data and tuple' })
        .click();
      await page.getByRole('button', { name: 'Next Question' }).click();

      // Question 3: correct answer
      await expect(page.getByRole('main')).toContainText(
        'Why is the B-tree index the default choice in PostgreSQL?'
      );
      await page.getByRole('radiogroup')
        .locator('div')
        .filter({ hasText: 'It efficiently supports a' })
        .click();
      await page.getByRole('button', { name: 'Next Question' }).click();

      // Question 4: correct answer
      await expect(page.getByRole('main')).toContainText(
        'Are indexes automatically created for foreign keys?'
      );
      await page.locator('div').filter({ hasText: /^No, indexes are not created automatically\.$/ }).click();
      await page.getByRole('button', { name: 'See Results' }).click();

      // Results: expect success
      await expect(page.getByRole('main')).toContainText('4 / 4');
      await expect(page.getByText('Passed')).toBeVisible();
      await expect(page.getByRole('main')).toContainText('Congratulations! You got all questions correct.');
    });
  });
});
