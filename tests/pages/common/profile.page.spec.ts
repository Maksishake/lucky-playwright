/**
 * Profile Page Tests
 * Тесты для страницы профиля пользователя
 */

import { test, expect } from '@playwright/test';
import { ProfilePage } from '@pages/common/profile.page';
import { Routes } from '../../../config/routes';

test.describe('Profile Page', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await page.goto(Routes.PROFILE);
    await profilePage.waitForLoad();
  });

  test.describe('Basic Functionality', () => {
    test('should load successfully', async () => {
      await expect(profilePage.isLoaded()).resolves.toBeTruthy();
    });

    test('should display user information', async () => {
      const userData = await profilePage.getUserData();
      expect(userData.email).toBeTruthy();
      expect(userData.userId).toBeTruthy();
      expect(userData.avatarUrl).toBeTruthy();
    });

    test('should display profile tabs', async () => {
      await expect(profilePage.profileTabs.isLoaded()).resolves.toBeTruthy();
      const tabNames = await profilePage.profileTabs.getAllTabNames();
      expect(tabNames).toContain('Огляд');
      expect(tabNames).toContain('Деталі користувача');
      expect(tabNames).toContain('Безпека');
      expect(tabNames).toContain('Верифікація');
    });

    test('should display profile form', async () => {
      await expect(profilePage.profileForm.isLoaded()).resolves.toBeTruthy();
    });
  });

  test.describe('User Information', () => {
    test('should get user email', async () => {
      const email = await profilePage.getUserEmail();
      expect(email).toContain('@');
    });

    test('should get user ID', async () => {
      const userId = await profilePage.getUserId();
      expect(userId).toBeTruthy();
    });

    test('should get avatar URL', async () => {
      const avatarUrl = await profilePage.getAvatarUrl();
      expect(avatarUrl).toContain('avatar');
    });

    test('should get avatar alt text', async () => {
      const avatarAlt = await profilePage.getAvatarAlt();
      expect(avatarAlt).toBeTruthy();
    });
  });

  test.describe('Tab Navigation', () => {
    test('should switch to overview tab', async () => {
      await profilePage.switchToOverviewTab();
      await expect(profilePage.profileTabs.isOverviewTabActive()).resolves.toBeTruthy();
    });

    test('should switch to details tab', async () => {
      await profilePage.switchToDetailsTab();
      await expect(profilePage.profileTabs.isDetailsTabActive()).resolves.toBeTruthy();
    });

    test('should switch to security tab', async () => {
      await profilePage.switchToSecurityTab();
      await expect(profilePage.profileTabs.isSecurityTabActive()).resolves.toBeTruthy();
    });

    test('should switch to verification tab', async () => {
      await profilePage.switchToVerificationTab();
      await expect(profilePage.profileTabs.isVerificationTabActive()).resolves.toBeTruthy();
    });

    test('should get active tab name', async () => {
      const activeTab = await profilePage.getActiveTabName();
      expect(activeTab).toBeTruthy();
    });
  });

  test.describe('Form Interaction', () => {
    test('should fill first name', async () => {
      const firstName = 'John';
      await profilePage.fillFirstName(firstName);
      const formData = await profilePage.getFormData();
      expect(formData.firstName).toBe(firstName);
    });

    test('should fill last name', async () => {
      const lastName = 'Doe';
      await profilePage.fillLastName(lastName);
      const formData = await profilePage.getFormData();
      expect(formData.lastName).toBe(lastName);
    });

    test('should fill email', async () => {
      const email = 'john.doe@example.com';
      await profilePage.fillEmail(email);
      const formData = await profilePage.getFormData();
      expect(formData.email).toBe(email);
    });

    test('should select country', async () => {
      const countryCode = 'US';
      await profilePage.selectCountry(countryCode);
      // В реальном тесте здесь нужно проверить, что страна выбрана
    });

    test('should fill birth date', async () => {
      const birthDate = '01.01.1990';
      await profilePage.fillBirthDate(birthDate);
      const formData = await profilePage.getFormData();
      expect(formData.birthDate).toBe(birthDate);
    });

    test('should select gender', async () => {
      const gender = 'm';
      await profilePage.selectGender(gender);
      // В реальном тесте здесь нужно проверить, что пол выбран
    });

    test('should fill phone number', async () => {
      const phone = '+1234567890';
      await profilePage.fillPhone(phone);
      const formData = await profilePage.getFormData();
      expect(formData.phone).toBe(phone);
    });

    test('should save changes', async () => {
      await profilePage.saveChanges();
      // В реальном тесте здесь нужно проверить, что изменения сохранены
    });
  });

  test.describe('Form Validation', () => {
    test('should validate required fields', async () => {
      const areFieldsFilled = await profilePage.profileForm.areRequiredFieldsFilled();
      expect(areFieldsFilled).toBeFalsy(); // Поля пустые по умолчанию
    });

    test('should validate email format', async () => {
      await profilePage.fillEmail('invalid-email');
      const isEmailValid = await profilePage.profileForm.isEmailValid();
      expect(isEmailValid).toBeFalsy();
    });

    test('should validate phone format', async () => {
      await profilePage.fillPhone('invalid-phone');
      const isPhoneValid = await profilePage.profileForm.isPhoneValid();
      expect(isPhoneValid).toBeFalsy();
    });

    test('should check if form is ready to save', async () => {
      const isReady = await profilePage.profileForm.isFormReadyToSave();
      expect(isReady).toBeFalsy(); // Форма не готова к сохранению по умолчанию
    });
  });

  test.describe('Button Functionality', () => {
    test('should have logout button enabled', async () => {
      const isEnabled = await profilePage.isLogoutButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });

    test('should logout user', async () => {
      await profilePage.logout();
      // В реальном тесте здесь нужно проверить, что пользователь вышел
    });

    test('should copy user ID', async () => {
      await profilePage.copyUserId();
      // В реальном тесте здесь нужно проверить, что ID скопирован
    });
  });

  test.describe('State Checks', () => {
    test('should be fully loaded', async () => {
      const isFullyLoaded = await profilePage.isPageFullyLoaded();
      expect(isFullyLoaded).toBeTruthy();
    });

    test('should have avatar loaded', async () => {
      const isAvatarLoaded = await profilePage.isAvatarLoaded();
      expect(isAvatarLoaded).toBeTruthy();
    });

    test('should have form ready', async () => {
      const isFormReady = await profilePage.isFormReady();
      expect(isFormReady).toBeTruthy();
    });
  });

  test.describe('Complete Profile Info', () => {
    test('should get complete profile information', async () => {
      const profileInfo = await profilePage.getProfileInfo();
      
      expect(profileInfo.userData).toBeDefined();
      expect(profileInfo.formData).toBeDefined();
      expect(profileInfo.activeTab).toBeTruthy();
      expect(profileInfo.isFormReady).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing user card', async () => {
      // Удаляем карточку пользователя для тестирования обработки ошибок
      await profilePage.page.evaluate(() => {
        const element = document.querySelector('.card-user-profile');
        if (element) element.remove();
      });
      
      const userData = await profilePage.getUserData();
      expect(userData.email).toBe('');
    });

    test('should handle missing form fields', async () => {
      // Удаляем поля формы для тестирования обработки ошибок
      await profilePage.page.evaluate(() => {
        const elements = document.querySelectorAll('input[wire:model]');
        elements.forEach(el => el.remove());
      });
      
      const formData = await profilePage.getFormData();
      expect(formData.firstName).toBe('');
    });
  });
});
