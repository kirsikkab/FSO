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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {

        await page.getByRole('textbox').first().fill('wuffe')

        await page.getByRole('textbox').last().fill('salainen')

        await page.getByRole('button', { name: 'login' }).click()

    })

    test('a new blog can be created', async ({ page }) => {

        await page.getByRole('button', {
            name: 'create new blog'
        }).click()

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('React toimii')

        await textboxes.nth(1).fill('M. Koiranen')

        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', {
            name: 'create'
        }).click()

        await expect(
            page.getByText('React toimii').last()
        ).toBeVisible()

    })

    test('a blog can be liked', async ({ page }) => {

        await page.getByRole('button', {
            name: 'create new blog'
        }).click()

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('React toimii')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', {
            name: 'create'
        }).click()

        // etsitään juuri luotu blogi
        const blogElement = page.getByText('React toimii').last()

        // avataan juuri tämän blogin tiedot
        await blogElement
        .locator('..')
        .getByRole('button', { name: 'view' })
        .click()

        // likes näkyy
        await expect(
        page.getByText('likes 0')
        ).toBeVisible()

        // painetaan like
        await page.getByRole('button', {
        name: 'like'
        }).click()

        // tarkistetaan että likes kasvoi
        await expect(
            page.getByText('likes 1')
        ).toBeVisible()

    })

   test('a blog can be deleted by the user who created it', async ({ page }) => {

        // luodaan blogi
        await page.getByRole('button', {
            name: 'create new blog'
        }).click()

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('Poistettava blogi')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', {
            name: 'create'
        }).click()

        // avataan blogin tiedot
        const blogElement = page
            .getByText('Poistettava blogi')
            .last()

        await blogElement
            .locator('..')
            .getByRole('button', { name: 'view' })
            .click()

        // hyväksytään confirm-dialogi
        page.on('dialog', dialog => dialog.accept())

        // painetaan remove
        await page.getByRole('button', {
            name: 'remove'
        }).click()

        // varmistetaan että blogi poistui
        await expect(
            page.getByText('Poistettava blogi').last()
        ).not.toBeVisible()
    })

})})