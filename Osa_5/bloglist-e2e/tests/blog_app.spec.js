const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {

    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Minni Koiranen',
        username: 'wuffe',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {

    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()

  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {

      await page.getByRole('textbox').first().fill('wuffe')

      await page.getByRole('textbox').last().fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Minni Koiranen logged in')
      ).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {

      await page.getByRole('textbox').first().fill('wuffe')

      await page.getByRole('textbox').last().fill('vääräsalasana')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()

      await expect(
        page.getByText('Minni Koiranen logged in')
      ).not.toBeVisible()

    })
  })
})