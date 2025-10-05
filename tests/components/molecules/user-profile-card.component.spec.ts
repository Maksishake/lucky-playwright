/**
 * User Profile Card Component Tests
 * Тесты для компонента карточки пользователя
 */

import { test, expect } from '@playwright/test';
import { UserProfileCardComponent } from '@components/molecules/user-profile-card';

test.describe('UserProfileCardComponent', () => {
  let userProfileCard: UserProfileCardComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setContent(`
      <div class="row-card card-user-profile">
        <div class="row-card-col gap-lg">
          <div class="row-card-col__inner">
            <img src="https://luckycoin777.live/casino/v1/lucky/assets/images/avatar.png" alt="User Avatar" class="icon-4xl">
          </div>
          <div class="row-card-col__inner">
            <div class="text-white h4 mt-0 mb-xs">
              justshmv@gmail.com
            </div>
            <div class="badge border-gray body-min clipboard">
              <span class="clipboard-value">
                ZN3297367
              </span>
              <span class="icon clipboard-icon">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5273 0.673096H2.58446C1.79018 0.673096 1.14032 1.32764 1.14032 2.12764V11.5822C1.14032 11.9822 1.46525 12.3095 1.86239 12.3095C2.25953 12.3095 2.58446 11.9822 2.58446 11.5822V2.85491C2.58446 2.45491 2.9094 2.12764 3.30653 2.12764H10.5273C10.9244 2.12764 11.2493 1.80037 11.2493 1.40037C11.2493 1.00037 10.9244 0.673096 10.5273 0.673096ZM13.4155 3.58219H5.47275C4.67847 3.58219 4.02861 4.23673 4.02861 5.03673V15.2186C4.02861 16.0186 4.67847 16.6731 5.47275 16.6731H13.4155C14.2098 16.6731 14.8597 16.0186 14.8597 15.2186V5.03673C14.8597 4.23673 14.2098 3.58219 13.4155 3.58219ZM12.6935 15.2186H6.19482C5.79768 15.2186 5.47275 14.8913 5.47275 14.4913V5.764C5.47275 5.36401 5.79768 5.03673 6.19482 5.03673H12.6935C13.0906 5.03673 13.4155 5.36401 13.4155 5.764V14.4913C13.4155 14.8913 13.0906 15.2186 12.6935 15.2186Z" fill="currentColor"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    `);
    userProfileCard = new UserProfileCardComponent(page, page.locator('.card-user-profile'));
  });

  test('should be loaded', async () => {
    await expect(userProfileCard.isLoaded()).resolves.toBeTruthy();
  });

  test('should get user email', async () => {
    await expect(userProfileCard.getEmail()).resolves.toBe('justshmv@gmail.com');
  });

  test('should get user ID', async () => {
    await expect(userProfileCard.getUserId()).resolves.toBe('ZN3297367');
  });

  test('should get avatar URL', async () => {
    await expect(userProfileCard.getAvatarUrl()).resolves.toContain('avatar.png');
  });

  test('should get avatar alt text', async () => {
    await expect(userProfileCard.getAvatarAlt()).resolves.toBe('User Avatar');
  });

  test('should get full user info', async () => {
    const userInfo = await userProfileCard.getUserInfo();
    expect(userInfo.email).toBe('justshmv@gmail.com');
    expect(userInfo.userId).toBe('ZN3297367');
    expect(userInfo.avatarUrl).toContain('avatar.png');
    expect(userInfo.avatarAlt).toBe('User Avatar');
  });

  test('should copy user ID', async () => {
    await userProfileCard.copyUserId();
    await expect(userProfileCard.copyIdButton.root).toBeEnabled();
  });

  test('should click avatar', async () => {
    await userProfileCard.clickAvatar();
    await expect(userProfileCard.userAvatar).toBeVisible();
  });

  test('should click email', async () => {
    await userProfileCard.clickEmail();
    await expect(userProfileCard.userEmail).toBeVisible();
  });

  test('should check if avatar is loaded', async () => {
    await expect(userProfileCard.isAvatarLoaded()).resolves.toBeTruthy();
  });

  test('should check if email is visible', async () => {
    await expect(userProfileCard.isEmailVisible()).resolves.toBeTruthy();
  });

  test('should check if user ID is visible', async () => {
    await expect(userProfileCard.isUserIdVisible()).resolves.toBeTruthy();
  });

  test('should check if copy button is enabled', async () => {
    await expect(userProfileCard.isCopyButtonEnabled()).resolves.toBeTruthy();
  });

  test('should validate email format', async () => {
    await expect(userProfileCard.isEmailValid()).resolves.toBeTruthy();
  });

  test('should check if user has ID', async () => {
    await expect(userProfileCard.hasUserId()).resolves.toBeTruthy();
  });

  test('should check if avatar is loaded correctly', async () => {
    await expect(userProfileCard.isAvatarLoadedCorrectly()).resolves.toBeTruthy();
  });

  test('should get avatar size', async () => {
    const size = await userProfileCard.getAvatarSize();
    expect(size.width).toBeGreaterThan(0);
    expect(size.height).toBeGreaterThan(0);
  });

  test('should get avatar styles', async () => {
    const styles = await userProfileCard.getAvatarStyles();
    expect(styles).toHaveProperty('borderRadius');
    expect(styles).toHaveProperty('objectFit');
    expect(styles).toHaveProperty('maxHeight');
  });
});
