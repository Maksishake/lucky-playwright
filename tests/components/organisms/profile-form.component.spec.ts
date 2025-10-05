/**
 * Profile Form Component Tests
 * Тесты для компонента формы профиля
 */

import { test, expect } from '@playwright/test';
import { ProfileFormComponent } from '@components/organisms/profile-form/profile-form.component';

test.describe('ProfileFormComponent', () => {
  let profileForm: ProfileFormComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Создаем мок HTML для тестирования
    await page.setContent(`
      <div class="card flex-col gap-sm bg-gray-dark p-lg pt-0 round-lg">
        <div class="row-card row-card--title-wrapper">
          <div class="row-card-col">
            <div class="slider-title">
              <img src="/profile.svg" alt="" class="icon">
              <span>Особистий профіль</span>
            </div>
          </div>
        </div>
        <div class="md:col-2 gap-lg pb-lg">
          <div class="flex-col gap-lg">
            <div class="form-group">
              <label for="firstName">Ім'я</label>
              <div class="form-group-container">
                <input type="text" id="firstName" class="form-control" placeholder="Ім'я" wire:model="firstName">
              </div>
            </div>
            <div class="form-group">
              <label for="lastName">Прізвище</label>
              <div class="form-group-container">
                <input type="text" id="lastName" class="form-control" placeholder="Прізвище" wire:model="lastName">
              </div>
            </div>
            <div class="form-group">
              <label for="email">Електронна адреса</label>
              <div class="form-group-container">
                <input type="email" id="email" class="form-control" placeholder="n/a" wire:model="email">
                <button type="button" class="btn btn-default form-group-btn" wire:click="sendEmailVerification">
                  <span wire:loading.remove="" wire:target="sendEmailVerification">Підтвердити</span>
                  <span wire:loading="" wire:target="sendEmailVerification">Відправка...</span>
                </button>
              </div>
              <div class="error-text">Email не підтверджено</div>
            </div>
          </div>
          <div class="flex-col gap-lg">
            <div class="form-group form-select" wire:click="toggleCountries">
              <div class="form-group-label">Країна</div>
              <div class="form-group-container justify-between">
                <div class="form-control" data-placeholder="Belarus"></div>
                <img src="/arrow.svg" alt="" class="icon">
              </div>
              <div class="form-select-dropdown">
                <ul class="form-select-options">
                  <li wire:click="setCountry('US')">United States</li>
                  <li wire:click="setCountry('UA')">Ukraine</li>
                  <li wire:click="setCountry('BY')">Belarus</li>
                </ul>
              </div>
            </div>
            <div class="form-group">
              <label for="currency">Валюта</label>
              <div class="form-group-container justify-between">
                <input type="text" id="currency" class="form-control" disabled="" placeholder="UAH">
              </div>
            </div>
            <div class="form-group">
              <label for="settings_birthday">Дата народження</label>
              <div class="form-group-container">
                <input type="text" id="settings_birthday" class="form-control date-picker" readonly="" placeholder="дд.мм.рррр" wire:model="date" value="">
                <img src="/calendar.svg" alt="" class="icon">
              </div>
            </div>
            <div class="form-group form-select" wire:click="toggleGenders">
              <div class="form-group-label">Стать</div>
              <div class="form-group-container justify-between">
                <div class="form-control" data-placeholder="-"></div>
                <img src="/arrow.svg" alt="" class="icon">
              </div>
              <div class="form-select-dropdown">
                <ul class="form-select-options">
                  <li wire:click="setGender('m')">Чоловіча</li>
                  <li wire:click="setGender('f')">Жіноча</li>
                </ul>
              </div>
            </div>
            <div class="form-group">
              <label for="phone">Номер телефону</label>
              <div class="form-group-container">
                <input type="text" id="phone" class="form-control" placeholder="+334-345-235-23 23" wire:model="phone">
              </div>
              <div class="error-text">Телефон не підтверджено</div>
            </div>
          </div>
        </div>
        <div class="md:flex-row-center gap-sm">
          <button type="button" class="btn btn-default btn-mob-with-ful" wire:click="save">
            <span wire:loading.remove="" wire:target="save">Зберегти зміни</span>
            <span wire:loading="" wire:target="save">Збереження...</span>
          </button>
        </div>
      </div>
    `);
    
    profileForm = new ProfileFormComponent(page, page.locator('.card'));
  });

  test.describe('Basic Functionality', () => {
    test('should be visible', async () => {
      await expect(profileForm.isVisible()).resolves.toBeTruthy();
    });

    test('should be loaded', async () => {
      await expect(profileForm.isLoaded()).resolves.toBeTruthy();
    });

    test('should wait for load', async () => {
      await expect(profileForm.waitForLoad()).resolves.not.toThrow();
    });
  });

  test.describe('Form Filling', () => {
    test('should fill first name', async () => {
      const firstName = 'John';
      await profileForm.fillFirstName(firstName);
      const value = await profileForm.getFirstName();
      expect(value).toBe(firstName);
    });

    test('should fill last name', async () => {
      const lastName = 'Doe';
      await profileForm.fillLastName(lastName);
      const value = await profileForm.getLastName();
      expect(value).toBe(lastName);
    });

    test('should fill email', async () => {
      const email = 'john.doe@example.com';
      await profileForm.fillEmail(email);
      const value = await profileForm.getEmail();
      expect(value).toBe(email);
    });

    test('should fill birth date', async () => {
      const birthDate = '01.01.1990';
      await profileForm.fillBirthDate(birthDate);
      const value = await profileForm.getBirthDate();
      expect(value).toBe(birthDate);
    });

    test('should fill phone number', async () => {
      const phone = '+1234567890';
      await profileForm.fillPhone(phone);
      const value = await profileForm.getPhone();
      expect(value).toBe(phone);
    });
  });

  test.describe('Dropdown Interactions', () => {
    test('should open country dropdown', async () => {
      await profileForm.openCountryDropdown();
      await expect(profileForm.isCountryDropdownOpen()).resolves.toBeTruthy();
    });

    test('should select country', async () => {
      await profileForm.selectCountry('US');
      // В реальном тесте здесь нужно проверить, что страна выбрана
    });

    test('should open gender dropdown', async () => {
      await profileForm.openGenderDropdown();
      await expect(profileForm.isGenderDropdownOpen()).resolves.toBeTruthy();
    });

    test('should select gender', async () => {
      await profileForm.selectGender('m');
      // В реальном тесте здесь нужно проверить, что пол выбран
    });
  });

  test.describe('Button Interactions', () => {
    test('should confirm email', async () => {
      await profileForm.confirmEmail();
      // В реальном тесте здесь нужно проверить, что email подтвержден
    });

    test('should save changes', async () => {
      await profileForm.saveChanges();
      // В реальном тесте здесь нужно проверить, что изменения сохранены
    });
  });

  test.describe('Form Data Retrieval', () => {
    test('should get form data', async () => {
      const formData = await profileForm.getFormData();
      expect(formData).toHaveProperty('firstName');
      expect(formData).toHaveProperty('lastName');
      expect(formData).toHaveProperty('email');
      expect(formData).toHaveProperty('country');
      expect(formData).toHaveProperty('birthDate');
      expect(formData).toHaveProperty('gender');
      expect(formData).toHaveProperty('phone');
    });

    test('should get selected country', async () => {
      const country = await profileForm.getSelectedCountry();
      expect(country).toBeTruthy();
    });

    test('should get selected gender', async () => {
      const gender = await profileForm.getSelectedGender();
      expect(gender).toBeTruthy();
    });
  });

  test.describe('Form Validation', () => {
    test('should check if form is ready', async () => {
      const isReady = await profileForm.isFormReady();
      expect(isReady).toBeTruthy();
    });

    test('should check if required fields are filled', async () => {
      const areFilled = await profileForm.areRequiredFieldsFilled();
      expect(areFilled).toBeFalsy(); // Поля пустые по умолчанию
    });

    test('should validate email format', async () => {
      await profileForm.fillEmail('invalid-email');
      const isValid = await profileForm.isEmailValid();
      expect(isValid).toBeFalsy();
    });

    test('should validate phone format', async () => {
      await profileForm.fillPhone('invalid-phone');
      const isValid = await profileForm.isPhoneValid();
      expect(isValid).toBeFalsy();
    });

    test('should check if form is ready to save', async () => {
      const isReady = await profileForm.isFormReadyToSave();
      expect(isReady).toBeFalsy(); // Форма не готова к сохранению по умолчанию
    });
  });

  test.describe('Button States', () => {
    test('should check if save button is enabled', async () => {
      const isEnabled = await profileForm.isSaveButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });

    test('should check if confirm email button is enabled', async () => {
      const isEnabled = await profileForm.isConfirmEmailButtonEnabled();
      expect(isEnabled).toBeTruthy();
    });
  });

  test.describe('Error States', () => {
    test('should check for email error', async () => {
      const hasError = await profileForm.hasEmailError();
      expect(hasError).toBeTruthy(); // В моке есть ошибка email
    });

    test('should check for phone error', async () => {
      const hasError = await profileForm.hasPhoneError();
      expect(hasError).toBeTruthy(); // В моке есть ошибка телефона
    });
  });

  test.describe('Dropdown States', () => {
    test('should check if country dropdown is open', async () => {
      const isOpen = await profileForm.isCountryDropdownOpen();
      expect(isOpen).toBeFalsy(); // По умолчанию закрыт
    });

    test('should check if gender dropdown is open', async () => {
      const isOpen = await profileForm.isGenderDropdownOpen();
      expect(isOpen).toBeFalsy(); // По умолчанию закрыт
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing form fields', async () => {
      // Удаляем поля формы для тестирования обработки ошибок
      await page.evaluate(() => {
        const elements = document.querySelectorAll('input[wire:model]');
        elements.forEach(el => el.remove());
      });
      
      const formData = await profileForm.getFormData();
      expect(formData.firstName).toBe('');
    });

    test('should handle missing dropdowns', async () => {
      // Удаляем выпадающие списки для тестирования обработки ошибок
      await page.evaluate(() => {
        const elements = document.querySelectorAll('.form-select-dropdown');
        elements.forEach(el => el.remove());
      });
      
      const country = await profileForm.getSelectedCountry();
      expect(country).toBe('');
    });

    test('should handle missing buttons', async () => {
      // Удаляем кнопки для тестирования обработки ошибок
      await page.evaluate(() => {
        const elements = document.querySelectorAll('button');
        elements.forEach(el => el.remove());
      });
      
      const isSaveEnabled = await profileForm.isSaveButtonEnabled();
      expect(isSaveEnabled).toBeFalsy();
    });
  });

  test.describe('Form Completion', () => {
    test('should fill all required fields', async () => {
      await profileForm.fillFirstName('John');
      await profileForm.fillLastName('Doe');
      await profileForm.fillEmail('john.doe@example.com');
      
      const areFilled = await profileForm.areRequiredFieldsFilled();
      expect(areFilled).toBeTruthy();
    });

    test('should validate all fields', async () => {
      await profileForm.fillFirstName('John');
      await profileForm.fillLastName('Doe');
      await profileForm.fillEmail('john.doe@example.com');
      await profileForm.fillPhone('+1234567890');
      
      const isEmailValid = await profileForm.isEmailValid();
      const isPhoneValid = await profileForm.isPhoneValid();
      const areFilled = await profileForm.areRequiredFieldsFilled();
      
      expect(isEmailValid).toBeTruthy();
      expect(isPhoneValid).toBeTruthy();
      expect(areFilled).toBeTruthy();
    });
  });
});
