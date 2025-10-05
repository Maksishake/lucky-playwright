/**
 * Global Locators
 * Глобальные локаторы для всего приложения
 */

export const GlobalLocators = {
  // Модальные окна
  MODAL: '.modal, [role="dialog"]',
  MODAL_BACKDROP: '.modal-backdrop, .overlay',
  MODAL_CLOSE: '.close, .modal-close, [data-dismiss="modal"]',
  
  // Загрузка
  LOADER: '.loader, .spinner, .loading',
  SKELETON: '.skeleton, .skeleton-loader',
  
  // Уведомления
  TOAST: '.toast, .notification, .alert',
  ERROR_MESSAGE: '.error, .error-message, .alert-danger',
  SUCCESS_MESSAGE: '.success, .success-message, .alert-success',
  
  // Формы
  FORM: 'form',
  INPUT: 'input',
  BUTTON: 'button',
  SUBMIT_BUTTON: 'button[type="submit"]',
  
  // Навигация
  HEADER: 'header, .header',
  FOOTER: 'footer, .footer',
  SIDEBAR: 'aside, .sidebar',
  NAV: 'nav, .nav',
  
  // Контент
  MAIN_CONTENT: 'main, .main-content, .content',
  CONTAINER: '.container',
  
  // Состояния
  LOADING_STATE: '[data-state="loading"]',
  ERROR_STATE: '[data-state="error"]',
  EMPTY_STATE: '[data-state="empty"]',
} as const;

export type GlobalLocatorKey = keyof typeof GlobalLocators;
export type GlobalLocatorValue = typeof GlobalLocators[GlobalLocatorKey];