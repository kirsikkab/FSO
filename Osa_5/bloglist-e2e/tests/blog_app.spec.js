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

    await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Toinen Käyttäjä',
            username: 'toinen',
            password: 'salasana2'
        }
    })

    await page.goto('http://localhost:5173')
  })

  /* test('Login form is shown', async ({ page }) => {

    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()

  }) */

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {

        await page.goto('http://localhost:5173/login')

        await page.getByRole('textbox').first().fill('wuffe')

        await page.getByRole('textbox').last().fill('salainen')

        await page.getByRole('button', { name: 'login' }).click()

        await expect(
          page.getByRole('button', { name: 'logout' })
        ).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.goto('http://localhost:5173/login')

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
        await page.goto('http://localhost:5173/login')

        await page.getByRole('textbox').first().fill('wuffe')
        await page.getByRole('textbox').last().fill('salainen')

        await page.getByRole('button', { name: 'login' }).click()

        await expect(
            page.getByRole('button', { name: 'logout' })
        ).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
        await page.goto('http://localhost:5173/create')

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('React toimii')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', { name: 'create' }).click()

        await expect(
            page.getByRole('link', {
                name: 'React toimii by M. Koiranen'
            })
        ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await page.goto('http://localhost:5173/create')

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('React toimii')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', { name: 'create' }).click()

        await page.getByRole('link', {
            name: 'React toimii by M. Koiranen'
        }).click()

        await expect(
            page.getByText('likes 0')
        ).toBeVisible()

        await page.getByRole('button', {
            name: 'like'
        }).click()

        await expect(
            page.getByText('likes 1')
        ).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
        await page.goto('http://localhost:5173/create')

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('Poistettava blogi')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', { name: 'create' }).click()

        await page.getByRole('link', {
            name: 'Poistettava blogi by M. Koiranen'
        }).click()

        page.on('dialog', dialog => dialog.accept())

        await page.getByRole('button', {
            name: 'remove'
        }).click()

        await expect(
            page.locator('.blog').filter({
            hasText: 'Poistettava blogi'
            })
        ).toHaveCount(0)
    })

    /* test('only the user who added the blog sees the remove button', async ({ page }) => {

        // luodaan blogi käyttäjällä wuffe
        await page.getByRole('button', {
            name: 'create new blog'
        }).click()

        const textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('Salainen blogi')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://example.com')

        await page.getByRole('button', {
            name: 'create'
        }).click()

        // kirjaudutaan ulos
        await page.getByRole('button', {
            name: 'logout'
        }).click()

        //await page.pause() 

        await expect(
            page.getByRole('button', { name: 'login' })
        ).toBeVisible()

        // kirjaudutaan toisella käyttäjällä
        await page.getByRole('textbox').first().fill('toinen')

        await page.getByRole('textbox').last().fill('salasana2')

        await page.getByRole('button', {
            name: 'login'
        }).click()

        // tarkistetaan että toinen käyttäjä todella kirjautui sisään
        await expect(
            page.getByText('Toinen Käyttäjä logged in')
        ).toBeVisible()

        await page.reload()

        // odotetaan että blogi näkyy listassa
        await expect(
            page.getByText('Salainen blogi')
        ).toBeVisible()

        // etsitään juuri tämä blogi
        const blogElement = page
            .getByText('Salainen blogi')
            .last()

        // avataan juuri tämän blogin view-nappi
        await blogElement
            .locator('..')
            .getByRole('button', { name: 'view' })
            .click()

        // remove-nappia EI saa näkyä
        await expect(
            page.getByRole('button', {
            name: 'remove'
            })
        ).not.toBeVisible()

        }) */

    /* test('blogs are ordered according to likes', async ({ page }) => {
        await page.getByRole('button', {
            name: 'create new blog'
        }).click()

        let textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('Ensimmäinen blogi')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://eka.fi')

        await page.getByRole('button', {
            name: 'create'
        }).click()

        await page.getByRole('button', {
            name: 'create new blog'
        }).click()

        textboxes = page.getByRole('textbox')

        await textboxes.nth(0).fill('Toinen blogi')
        await textboxes.nth(1).fill('M. Koiranen')
        await textboxes.nth(2).fill('https://toka.fi')

        await page.getByRole('button', {
        name: 'create'
        }).click()

        const viewButtons = page.getByRole('button', {
            name: 'view'
        })

        const count = await viewButtons.count()

        await viewButtons.nth(count - 2).click()
        await viewButtons.nth(count - 1).click()

        const likeButtons = page.getByRole('button', {
            name: 'like'
        })

        await likeButtons.nth(1).click()
        await likeButtons.nth(1).click()
        await likeButtons.nth(1).click()

        const blogs = await page
            .locator('.blog')
            .allTextContents()
       
        expect(blogs[0]).toContain('Toinen blogi')
        expect(blogs[1]).toContain('Ensimmäinen blogi')

    }) */

})})