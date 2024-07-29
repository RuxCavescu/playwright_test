const {test, expect} = require ('@playwright/test')

test('thrown error when using public domains', async ({page}) => {
    const mockRegisterData = {
        username: 'InterviewUser',
        password: 'InreviewUser',
        email: 'inreviewuser@gmail.com',
    }

    const warningText = "Please note that you will need to enter a valid email address before your account is activated. You will receive an email at the address you provide that contains an account activation link."

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
    const forumsButton = page.locator('a.list-of-links__link', {hasText: 'R&D Forums'});
    await expect(forumsButton).toBeVisible();
    await forumsButton.click();
    
    // wait for the page to load and check URL change
    await page.waitForLoadState();
    await expect(page).toHaveURL('https://forums.veeam.com/?ad=menu-support');
    
    // locate and click Register button
    const registerButton = page.getByRole('menuitem', {name: 'Register'});
    await expect(registerButton).toBeVisible();
    await registerButton.click();
    
    await page.waitForLoadState();

    // check if correct redirect
    await expect(page).toHaveTitle('R&D ForumsUser Control Panel - ');
    
    // locate and click agree to terms button
    const agreeButton = page.getByRole('button', {name: 'I agree to these terms'});
    // await expect(agreeButton).toBeVisible();
    const agreeButtonStyle = await agreeButton.evaluate((elem) => window.getComputedStyle(elem).display);
    // Check that the display style is not 'none'
    expect(agreeButtonStyle).not.toBe('none'); // Ensures the element is not hidden using display: none;
    await agreeButton.click();
    
    // looks like the page has a temporary id in the url as well 
    await page.waitForLoadState();
    await expect(page).toHaveURL(/https:\/\/forums\.veeam\.com\/ucp\.php\?mode=register.*/);
    
    // check if correct redirect
    const warningBox = page.locator('dd').filter({ hasText: `${warningText}` })
    // since the element does not have a visibility property, we'll check for display:
    const displayWarningBoxStyle = await warningBox.evaluate((elem) => window.getComputedStyle(elem).display);
    // Check that the display style is not 'none'
    expect(displayWarningBoxStyle).not.toBe('none'); // Ensures the element is not hidden using display: none;
    // await expect(warningBox).toBeVisible();
    
    // fill in registration form
    await page.getByLabel('Username:').fill(`${mockRegisterData.username}`);
    await page.getByLabel('Password:', {exact: true}).fill(`${mockRegisterData.password}`);
    await page.getByLabel('Confirm password:', {exact: true}).fill(`${mockRegisterData.password}`);
    await page.getByLabel('Email address:').fill(`${mockRegisterData.email}`);
    
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();
    
    await page.waitForLoadState();

    const errorBox = page.locator('dd.error');
    await errorBox.waitFor();
    // await expect(errorBox).toBeVisible();
    const displayErrorBoxStyle = await errorBox.evaluate((elem) => window.getComputedStyle(elem).display);
    // Check that the display style is not 'none'
    expect(displayErrorBoxStyle).not.toBe('none');
})
