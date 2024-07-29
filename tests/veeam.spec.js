const {test, expect} = require ('@playwright/test')

test('thrown error when using public domains', async ({page}) => {
    const mockRegisterData = {
        username: 'InterviewUser',
        password: 'InreviewUser',
        email: 'inreviewuser@gmail.com',
    }

    // load page and check if it's the correct page
    await page.goto("https://www.veeam.com/");
    await expect(page).toHaveTitle("#1 Global Leader in Data Resilience");

    // locate navigation
    const mainNavigation = page.locator('nav.main-navigation');
    await expect(mainNavigation).toBeVisible();
    
    // locate and click Support button
    const supportButton = mainNavigation.locator('li.main-navigation__item', { hasText: 'Support' });
    await expect(supportButton).toBeVisible();
    await supportButton.click();

    // locate and click R&D Forums button
    const forumsButton = page.locator('a', {hasText: 'R&D Forums'});
    await expect(forumsButton).toBeVisible();
    await forumsButton.click();

    // wait for the page to load and check URL change
    await page.waitForLoadState();
    await expect(page).toHaveURL('https://forums.veeam.com/?ad=menu-support');
    
    // locate and click Register button
    const registerButton = page.getByRole('menuitem', {name: 'Register'});
    await expect(registerButton).toBeVisible();
    await registerButton.click();

    // check if correct redirect
    await page.waitForLoadState();
    await expect(page).toHaveTitle('R&D ForumsUser Control Panel - ');
    // looks like the page has a temporary id in the url as well
    await expect(page).toHaveURL(/https:\/\/forums\.veeam\.com\/ucp\.php\?mode=register.*/);
    
    // locate and click agree to terms button
    const agreeButton = page.getByText('I agree to these terms')

    // since the element does not have a visibility property, we'll check for display:
    const agreeButtonStyle = await agreeButton.evaluate((elem) => window.getComputedStyle(elem).display);
    // check that the display style is not 'none'
    expect(agreeButtonStyle).not.toBe('none');
    await agreeButton.click();
    
    await expect(page).toHaveURL('https://forums.veeam.com/ucp.php?mode=register');
    await page.waitForLoadState();

    // check if correct redirect
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const submitButtonStyle = await submitButton.evaluate((elem) => window.getComputedStyle(elem).display);
    expect(submitButtonStyle).not.toBe('none');
    
    // fill in registration form
    await page.getByLabel('Username:').fill(`${mockRegisterData.username}`);
    await page.getByLabel('Password:', {exact: true}).fill(`${mockRegisterData.password}`);
    await page.getByLabel('Confirm password:', {exact: true}).fill(`${mockRegisterData.password}`);
    await page.getByLabel('Email address:').fill(`${mockRegisterData.email}`);
    
    await submitButton.click();
    
    // wait for the page to load
    await page.waitForLoadState();

    // locate the error component
    const errorBox = page.locator('dd.error');
    await errorBox.waitFor();
    const displayErrorBoxStyle = await errorBox.evaluate((elem) => window.getComputedStyle(elem).display);
    expect(displayErrorBoxStyle).not.toBe('none');
})
