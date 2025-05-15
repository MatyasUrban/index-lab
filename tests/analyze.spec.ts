import { test, expect } from "@playwright/test";

test.describe('ANALYZE', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to analyze page
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('link', { name: 'Start Analyzing' })).toBeVisible();
    await page.getByRole('link', { name: 'Start Analyzing' }).click();
    await page.waitForURL('**/analyze');
    await expect(page.getByRole('paragraph')).toContainText('Click "Digest Plan" to generate insights from your execution plan');
  });

  test.describe('Unhappy Path', () => {
    test('should show error on invalid JSON structure', async ({ page }) => {
      await page.getByRole('textbox', { name: "Paste the result of your '" }).click();
      await page.getByRole('textbox', { name: "Paste the result of your '" }).fill(JSON.stringify(plan[0]));
      await page.getByRole('button', { name: 'Digest Plan' }).click();
      await expect(page.getByRole('heading', { name: 'Error' })).toBeVisible();
      await expect(page.getByRole('main')).toContainText('Input must be a valid PostgreSQL execution plan JSON array');
    });
  });

  test.describe('Happy Path', () => {
    test('should display plan insights on valid JSON', async ({ page }) => {
      await page.getByRole('textbox', { name: "Paste the result of your '" }).click();
      await page.getByRole('textbox', { name: "Paste the result of your '" }).press('ControlOrMeta+a');
      await page.getByRole('textbox', { name: "Paste the result of your '" }).fill(JSON.stringify(plan));
      await page.getByRole('button', { name: 'Digest Plan' }).click();

      // Basic insights
      await expect(page.getByText('Planning and Execution Time')).toBeVisible();
      await expect(page.getByText('Query Plan Nodes')).toBeVisible();
      await expect(page.getByText(`Planning Time${plan[0]['Planning Time']} ms`)).toBeVisible();
      await expect(page.getByText(`Execution Time${plan[0]['Execution Time']} ms`)).toBeVisible();
      await expect(page.getByText('Data Flow', { exact: true })).toBeVisible();
      await expect(page.getByText('Expected Node Startup & Total')).toBeVisible();
      await expect(page.getByText('Actual Node Startup & Total')).toBeVisible();
    });
  });
});

const plan = [{
  "Plan": {
    "Node Type": "Nested Loop",
    "Parallel Aware": false,
    "Async Capable": false,
    "Join Type": "Inner",
    "Startup Cost": 5.52,
    "Total Cost": 747.31,
    "Plan Rows": 1,
    "Plan Width": 117,
    "Actual Startup Time": 0.03,
    "Actual Total Time": 0.049,
    "Actual Rows": 2,
    "Actual Loops": 1,
    "Inner Unique": true,
    "Plans": [{
      "Node Type": "Nested Loop",
      "Parent Relationship": "Outer",
      "Parallel Aware": false,
      "Async Capable": false,
      "Join Type": "Inner",
      "Startup Cost": 5.37,
      "Total Cost": 747.14,
      "Plan Rows": 1,
      "Plan Width": 23,
      "Actual Startup Time": 0.026,
      "Actual Total Time": 0.043,
      "Actual Rows": 2,
      "Actual Loops": 1,
      "Inner Unique": false,
      "Plans": [{
        "Node Type": "Bitmap Heap Scan",
        "Parent Relationship": "Outer",
        "Parallel Aware": false,
        "Async Capable": false,
        "Relation Name": "employee",
        "Alias": "e",
        "Startup Cost": 4.94,
        "Total Cost": 226.64,
        "Plan Rows": 63,
        "Plan Width": 23,
        "Actual Startup Time": 0.013,
        "Actual Total Time": 0.017,
        "Actual Rows": 3,
        "Actual Loops": 1,
        "Recheck Cond": "((hire_date >= '1999-12-31'::date) AND (hire_date <= '2000-01-01'::date))",
        "Rows Removed by Index Recheck": 0,
        "Exact Heap Blocks": 3,
        "Lossy Heap Blocks": 0,
        "Plans": [{
          "Node Type": "Bitmap Index Scan",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Index Name": "idx_employee_hire_date",
          "Startup Cost": 0,
          "Total Cost": 4.93,
          "Plan Rows": 63,
          "Plan Width": 0,
          "Actual Startup Time": 0.006,
          "Actual Total Time": 0.006,
          "Actual Rows": 3,
          "Actual Loops": 1,
          "Index Cond": "((hire_date >= '1999-12-31'::date) AND (hire_date <= '2000-01-01'::date))"
        }]
      }, {
        "Node Type": "Index Scan",
        "Parent Relationship": "Inner",
        "Parallel Aware": false,
        "Async Capable": false,
        "Scan Direction": "Forward",
        "Index Name": "department_employee_pkey",
        "Relation Name": "department_employee",
        "Alias": "de",
        "Startup Cost": 0.42,
        "Total Cost": 8.25,
        "Plan Rows": 1,
        "Plan Width": 12,
        "Actual Startup Time": 0.007,
        "Actual Total Time": 0.007,
        "Actual Rows": 1,
        "Actual Loops": 3,
        "Index Cond": "(employee_id = e.id)",
        "Rows Removed by Index Recheck": 0,
        "Filter": "(e.hire_date = from_date)",
        "Rows Removed by Filter": 0
      }]
    }, {
      "Node Type": "Index Scan",
      "Parent Relationship": "Inner",
      "Parallel Aware": false,
      "Async Capable": false,
      "Scan Direction": "Forward",
      "Index Name": "department_pkey",
      "Relation Name": "department",
      "Alias": "d",
      "Startup Cost": 0.15,
      "Total Cost": 0.17,
      "Plan Rows": 1,
      "Plan Width": 102,
      "Actual Startup Time": 0.002,
      "Actual Total Time": 0.002,
      "Actual Rows": 1,
      "Actual Loops": 2,
      "Index Cond": "(id = de.department_id)",
      "Rows Removed by Index Recheck": 0
    }]
  }, "Planning Time": 0.375, "Triggers": [], "Execution Time": 0.078
}];