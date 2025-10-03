# 🚀 Быстрый переход с Helpers на Business Commands

## **⚡ 5-минутная миграция**

### **1. Замените импорты**
```typescript
// ❌ Было
import { AuthHelper, ProfileHelper, NavigationHelper, GamesHelper } from '../../helpers/test-helpers';

// ✅ Стало  
import { test, authenticatedTest } from '../setup/business-fixtures';
```

### **2. Удалите ручную инициализацию**
```typescript
// ❌ Было
test.describe('Тесты', () => {
  let factory: PageObjectFactory;
  let authHelper: AuthHelper;
  let profileHelper: ProfileHelper;

  test.beforeEach(async ({ page }) => {
    factory = new PageObjectFactory(page);
    authHelper = new AuthHelper(page, factory);
    profileHelper = new ProfileHelper(page, factory);
    await authHelper.ensureLoggedIn();
  });

// ✅ Стало
test.describe('Тесты', () => {
  // Ничего не нужно! Фикстуры делают всё автоматически
```

### **3. Используйте Business Commands в тестах**
```typescript
// ❌ Было
test('Тест', async () => {
  const isLoggedIn = await authHelper.isUserLoggedIn();
  const email = await profileHelper.getUserEmail();
});

// ✅ Стало
test('Тест', async ({ authCommands, profileCommands }) => {
  const isLoggedIn = await authCommands.isUserLoggedIn();
  const email = await profileCommands.getUserEmail();
});
```

### **4. Используйте authenticatedTest для авторизованных тестов**
```typescript
// ❌ Было
test('Тест с авторизацией', async () => {
  await authHelper.ensureLoggedIn();
  const email = await profileHelper.getUserEmail();
});

// ✅ Стало
authenticatedTest('Тест с авторизацией', async ({ profileCommands }) => {
  // Пользователь уже залогинен!
  const email = await profileCommands.getUserEmail();
});
```

---

## **📋 Таблица соответствия методов**

| Функция | Helper | Business Command |
|---------|--------|------------------|
| **Авторизация** | `authHelper.ensureLoggedIn()` | `authCommands.ensureLoggedIn()` |
| **Проверка логина** | `authHelper.isUserLoggedIn()` | `authCommands.isUserLoggedIn()` |
| **Получение email** | `profileHelper.getUserEmail()` | `profileCommands.getUserEmail()` |
| **Открытие профиля** | `profileHelper.openProfile()` | `profileCommands.openProfile()` |
| **Навигация** | `navigationHelper.goto()` | `navigationCommands.gotoAndVerify()` |
| **Игры** | `gamesHelper.testRandomSlots()` | `gamesCommands.testRandomSlotsFromProvider()` |
| **Кошелек** | `walletHelper.openWallet()` | `walletCommands.openWallet()` |

---

## **🎯 Готовые примеры**

### **Простой тест**
```typescript
test('Проверка авторизации', async ({ authCommands }) => {
  const isLoggedIn = await authCommands.isUserLoggedIn();
  expect(isLoggedIn).toBeTruthy();
});
```

### **Тест с авторизацией**
```typescript
authenticatedTest('Проверка профиля', async ({ profileCommands }) => {
  const email = await profileCommands.getUserEmail();
  expect(email).toContain('@');
});
```

### **Комплексный тест**
```typescript
test('Полный сценарий', async ({ 
  authCommands, 
  profileCommands, 
  walletCommands,
  gamesCommands 
}) => {
  // 1. Проверяем авторизацию
  const isLoggedIn = await authCommands.isUserLoggedIn();
  expect(isLoggedIn).toBeTruthy();
  
  // 2. Получаем данные профиля
  const email = await profileCommands.getUserEmail();
  expect(email).toBeDefined();
  
  // 3. Работаем с кошельком
  await walletCommands.openWallet();
  
  // 4. Тестируем игры
  const games = await gamesCommands.searchGamesOnPage();
  expect(games.length).toBeGreaterThan(0);
});
```

---

## **🚀 Запуск**

```bash
# Запуск нового теста
npm run test tests/smoke-and-regression/luckycoin-business-commands.spec.ts

# Запуск с UI
npm run test:ui tests/smoke-and-regression/luckycoin-business-commands.spec.ts

# Запуск только smoke тестов
npm run test:smoke tests/smoke-and-regression/luckycoin-business-commands.spec.ts
```

---

## **✅ Результат**

- ✅ **Меньше кода** - нет ручной инициализации
- ✅ **Автоматизация** - фикстуры делают всё сами
- ✅ **Чистота** - каждый тест фокусируется на логике
- ✅ **Типизация** - полная поддержка TypeScript
- ✅ **Переиспользование** - команды доступны везде

---

## **📚 Дополнительно**

- 📖 **Полное руководство**: `MIGRATION_GUIDE.md`
- 🧪 **Примеры тестов**: `tests/examples/business-commands-example.spec.ts`
- 🔧 **Фикстуры**: `tests/setup/business-fixtures.ts`
- 🏗️ **Business Commands**: `business/` директория
