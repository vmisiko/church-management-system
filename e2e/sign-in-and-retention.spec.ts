import { test, expect } from '@playwright/test'

// Matches docs/LOCAL-DEMO-RUNBOOK.md's seeded admin account. Override via env
// if a different stack (CI, another dev's machine) uses different credentials.
const EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@citymega.org'
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'Admin@123456'

test('signs in and loads the retention page', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('admin@citymega.org').fill(EMAIL)
  await page.getByPlaceholder('••••••••').fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Lands on the dashboard once authenticated. Generous timeout: in Next.js
  // dev mode the first hit on a route compiles on demand, which can take
  // several seconds longer than Playwright's 5s default.
  await expect(page).toHaveURL('/', { timeout: 20_000 })
  await expect(
    page.getByText('Good morning,').or(page.getByText('Good afternoon,')).or(page.getByText('Good evening,')),
  ).toBeVisible({ timeout: 20_000 })

  await page.goto('/retention')

  await expect(page.getByRole('heading', { name: 'Retention' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('30-day retention', { exact: true })).toBeVisible()
  await expect(page.getByText('Retention Trend')).toBeVisible()
  await expect(page.getByText('At-risk members').first()).toBeVisible()

  // No console errors anywhere along the way.
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Retention' })).toBeVisible()
  expect(errors).toEqual([])
})
