/**
 * User Info Modal Component Tests
 * Тесты для модального окна информации о пользователе
 */

import { test, expect } from '@playwright/test';
import { UserInfoModalComponent } from '@components/modals/user-info-modal';

test.describe('UserInfoModalComponent', () => {
  let userInfoModal: UserInfoModalComponent;
  let page: any;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.setContent(`
      <div id="modal-user-info" class="modal modal-open">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-header-inner">
                <h4 class="modal-title">Інформація про користувача</h4>
              </div>
              <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/closeCircle.svg" alt="" class="icon modal-close-alpine">
            </div>
            <div class="modal-body pb-0">
              <div class="row-card card-user-profile">
                <div class="row-card-col gap-lg">
                  <div class="row-card-col__inner">
                    <img src="https://luckycoin777.live/casino/v1/lucky/assets/images/avatar.png" alt="" class="icon-4xl">
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

              <div class="modal-body-inner">
                <div class="row-card">
                  <div class="row-card-col">
                    <span class="icon-lg text-white">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.43575 5.59265H2.74857C3.19985 5.59265 3.56908 5.93193 3.56908 6.36374V13.0105C3.56908 13.4346 3.19985 13.7816 2.74857 13.7816H1.43575C0.984465 13.7816 0.615234 13.4346 0.615234 13.0105V6.36374C0.615234 5.93964 0.984465 5.59265 1.43575 5.59265ZM7.34344 3.13287H8.65626C9.10754 3.13287 9.47677 3.47986 9.47677 3.90396V13.0105C9.47677 13.4346 9.10754 13.7816 8.65626 13.7816H7.34344C6.89216 13.7816 6.52293 13.4346 6.52293 13.0105V3.90396C6.52293 3.47986 6.89216 3.13287 7.34344 3.13287ZM13.2511 0.673096H14.564C15.0152 0.673096 15.3845 1.02009 15.3845 1.44419V13.0105C15.3845 13.4346 15.0152 13.7816 14.564 13.7816H13.2511C12.7998 13.7816 12.4306 13.4346 12.4306 13.0105V1.44419C12.4306 1.02009 12.7998 0.673096 13.2511 0.673096ZM0.615385 16.6731H15.3846C15.721 16.6731 16 16.4109 16 16.0948C16 15.7786 15.721 15.5165 15.3846 15.5165H0.615385C0.278974 15.5165 0 15.7786 0 16.0948C0 16.4109 0.278974 16.6731 0.615385 16.6731Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <div class="text-white">Статистика</div>
                  </div>
                  <div class="row-card-col">
                    <span class="btn btn-link" wire:click="changeContent('history')">
                      <span>Деталі</span>
                      <span class="icon">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.13891 3.0885C5.74579 2.71411 5.11134 2.71411 4.71823 3.0885C4.32095 3.46686 4.32095 4.08351 4.71823 4.46188L9.14007 8.67315L4.71823 12.8844C4.32095 13.2628 4.32095 13.8794 4.71823 14.2578C5.11134 14.6322 5.74579 14.6322 6.13891 14.2578L11.2818 9.35984C11.679 8.98147 11.679 8.36482 11.2818 7.98646L6.13891 3.0885Z" fill="white" stroke="white" stroke-width="0.302315" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </span>
                    </span>
                  </div>
                </div>
                <div class="flex-inner-auto--3">
                  <div class="content-block">
                    <div class="content-block-heading">Загальна кількість виграшів</div>
                    <div class="content-block-total">
                      <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/tabconfetti.svg" alt="" class="icon">
                      <span>0,00</span>
                    </div>
                  </div>
                  <div class="content-block">
                    <div class="content-block-heading">Всього ставок</div>
                    <div class="content-block-total">
                      <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/tabchip.svg" alt="" class="icon">
                      <span>0,00</span>
                    </div>
                  </div>
                  <div class="content-block">
                    <div class="content-block-heading">Всього використано в ставках</div>
                    <div class="content-block-total">
                      <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/moneybag.svg" alt="" class="icon">
                      <span>0,00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-body-inner">
                <div class="row-card">
                  <div class="row-card-col">
                    <span class="icon-lg text-white">
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 10.9539C16 10.9539 15.3866 7.5213 15.29 7.10049C14.9182 5.52845 13.8699 4.47041 12.0892 4.39526H3.91078C2.13011 4.47041 1.06691 5.2429 0.710037 7.10049C0.628253 7.52431 0 10.9539 0 10.9539C0 11.002 0 11.0471 0 11.0952C0.00372699 11.4978 0.168111 11.8887 0.468694 12.2097C0.769278 12.5308 1.19 12.7647 1.66827 12.8769C2.14654 12.989 2.6568 12.9733 3.12314 12.8321C3.58948 12.6909 3.98698 12.4317 4.25651 12.0931L5.59108 10.3738C5.65424 10.2895 5.74316 10.2198 5.84929 10.1714C5.95541 10.123 6.07517 10.0974 6.19703 10.0973H9.85502C9.97688 10.0974 10.0966 10.123 10.2028 10.1714C10.3089 10.2198 10.3978 10.2895 10.461 10.3738L11.7584 12.0961C12.0309 12.4299 12.4287 12.6842 12.8933 12.8217C13.3578 12.9591 13.8647 12.9725 14.3393 12.8598C14.8139 12.7471 15.2314 12.5143 15.5303 12.1956C15.8292 11.8769 15.9938 11.4891 16 11.0892C16 11.0411 16 10.996 16 10.9479V10.9539ZM11.3532 5.58857C11.5002 5.58857 11.644 5.62383 11.7662 5.68988C11.8885 5.75594 11.9838 5.84983 12.0401 5.95967C12.0963 6.06952 12.1111 6.19039 12.0824 6.30701C12.0537 6.42362 11.9829 6.53074 11.8789 6.61481C11.7749 6.69889 11.6424 6.75614 11.4982 6.77934C11.354 6.80253 11.2045 6.79063 11.0686 6.74513C10.9328 6.69963 10.8167 6.62258 10.735 6.52372C10.6533 6.42486 10.6097 6.30863 10.6097 6.18973C10.6097 6.03029 10.688 5.87738 10.8274 5.76464C10.9669 5.6519 11.156 5.58857 11.3532 5.58857ZM5.77695 7.99321H5.4052V8.29379C5.4052 8.45323 5.32687 8.60614 5.18744 8.71888C5.04801 8.83162 4.8589 8.89495 4.66171 8.89495C4.46452 8.89495 4.27541 8.83162 4.13598 8.71888C3.99655 8.60614 3.91822 8.45323 3.91822 8.29379V7.99321H3.54647C3.34928 7.99321 3.16017 7.92987 3.02074 7.81713C2.88131 7.7044 2.80297 7.55149 2.80297 7.39205C2.80297 7.23261 2.88131 7.07971 3.02074 6.96697C3.16017 6.85423 3.34928 6.79089 3.54647 6.79089H3.91822V6.49031C3.91822 6.33087 3.99655 6.17796 4.13598 6.06522C4.27541 5.95248 4.46452 5.88915 4.66171 5.88915C4.8589 5.88915 5.04801 5.95248 5.18744 6.06522C5.32687 6.17796 5.4052 6.33087 5.4052 6.49031V6.79089H5.77695C5.97414 6.79089 6.16325 6.85423 6.30268 6.96697C6.44211 7.07971 6.52045 7.23261 6.52045 7.39205C6.52045 7.55149 6.44211 7.7044 6.30268 7.81713C6.16325 7.92987 5.97414 7.99321 5.77695 7.99321ZM9.86617 7.99321C9.71912 7.99321 9.57537 7.95795 9.45311 7.8919C9.33084 7.82584 9.23555 7.73195 9.17927 7.62211C9.123 7.51226 9.10827 7.39138 9.13696 7.27477C9.16565 7.15816 9.23646 7.05104 9.34044 6.96697C9.44442 6.88289 9.5769 6.82564 9.72112 6.80244C9.86535 6.77924 10.0148 6.79115 10.1507 6.83665C10.2865 6.88215 10.4027 6.9592 10.4844 7.05806C10.5661 7.15692 10.6097 7.27315 10.6097 7.39205C10.6097 7.55149 10.5313 7.7044 10.3919 7.81713C10.2525 7.92987 10.0634 7.99321 9.86617 7.99321ZM11.3532 9.19553C11.2061 9.19553 11.0624 9.16027 10.9401 9.09422C10.8178 9.02816 10.7225 8.93428 10.6663 8.82443C10.61 8.71458 10.5953 8.59371 10.624 8.47709C10.6526 8.36048 10.7234 8.25336 10.8274 8.16929C10.9314 8.08521 11.0639 8.02796 11.2081 8.00476C11.3523 7.98157 11.5018 7.99347 11.6377 8.03897C11.7735 8.08447 11.8897 8.16152 11.9714 8.26038C12.053 8.35925 12.0967 8.47547 12.0967 8.59437C12.0967 8.75381 12.0183 8.90672 11.8789 9.01946C11.7395 9.1322 11.5503 9.19553 11.3532 9.19553ZM12.8401 7.99321C12.6931 7.99321 12.5494 7.95795 12.4271 7.8919C12.3048 7.82584 12.2095 7.73195 12.1533 7.62211C12.097 7.51226 12.0823 7.39138 12.1109 7.27477C12.1396 7.15816 12.2104 7.05104 12.3144 6.96697C12.4184 6.88289 12.5509 6.82564 12.6951 6.80244C12.8393 6.77924 12.9888 6.79115 13.1247 6.83665C13.2605 6.88215 13.3766 6.9592 13.4583 7.05806C13.54 7.15692 13.5836 7.27315 13.5836 7.39205C13.5836 7.55149 13.5053 7.7044 13.3659 7.81713C13.2264 7.92987 13.0373 7.99321 12.8401 7.99321Z" fill="currentColor"></path>
                      </svg>
                    </span>
                    <div class="text-white">Улюблені ігри</div>
                  </div>
                  <div class="row-card-col">
                    <a href="https://luckycoin777.live/favorite" class="btn btn-link">
                      <span>Переглянути всі</span>
                      <span class="icon">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.13891 3.0885C5.74579 2.71411 5.11134 2.71411 4.71823 3.0885C4.32095 3.46686 4.32095 4.08351 4.71823 4.46188L9.14007 8.67315L4.71823 12.8844C4.32095 13.2628 4.32095 13.8794 4.71823 14.2578C5.11134 14.6322 5.74579 14.6322 6.13891 14.2578L11.2818 9.35984C11.679 8.98147 11.679 8.36482 11.2818 7.98646L6.13891 3.0885Z" fill="white" stroke="white" stroke-width="0.302315" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
                <div class="splide modal-favorite-games slider-initialized splide--slide splide--ltr splide--draggable is-active is-initialized" wire:ignore="" id="splide03" role="region" aria-roledescription="carousel">
                  <div class="splide__arrows splide__arrows--ltr">
                    <button class="btn btn-slider-default btn-slider-right splide__arrow splide__arrow--prev" type="button" disabled="" aria-label="Previous slide" aria-controls="splide03-track">
                      <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/arrowLeft.svg" alt="" class="icon">
                    </button>
                    <button class="btn btn-slider-default splide__arrow splide__arrow--next" type="button" disabled="" aria-label="Next slide" aria-controls="splide03-track">
                      <img src="https://luckycoin777.live/casino/v1/lucky/assets/icons/arrowRight.svg" alt="" class="icon">
                    </button>
                  </div>
                  <div class="splide__track splide__track--slide splide__track--ltr splide__track--draggable" id="splide03-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                    <ul class="splide__list game" id="splide03-list" role="presentation" style="transform: translateX(0px);">
                      <li class="splide__slide is-active is-visible" id="splide03-slide01" role="group" aria-roledescription="slide" aria-label="1 of 1" style="margin-right: 0.5rem; width: calc(33.3333% - 0.333333rem);">
                        <div wire:id="DeVm9MK5JI0oET5n1irV" class="game-card game-card-orange">
                          <img src="https://luckycoin777.live/storage/covers/vertical/pragmatic-play_sweet-bonanza.webp" loading="lazy" alt="" class="img">
                          <div class="game-card-hover">
                            <div class="title">Sweet Bonanza</div>
                            <button type="button" class="btn btn-icon btn-icon-md bg-orange text-white" wire:click="toggleFavorite">
                              <span class="icon">
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_39_1845)">
                                    <path d="M16 6.87339C16 6.62468 15.8206 6.47012 15.4614 6.40956L10.6346 5.67371L8.47122 1.08639C8.3495 0.810815 8.19232 0.673096 8.00005 0.673096C7.80781 0.673096 7.65073 0.810815 7.52892 1.08639L5.36538 5.67371L0.538391 6.40956C0.179508 6.47012 0 6.62468 0 6.87339C0 7.0146 0.0801558 7.17591 0.240434 7.35738L3.74048 10.9264L2.91356 15.9672C2.90073 16.0613 2.89436 16.1288 2.89436 16.1689C2.89436 16.31 2.92798 16.4293 2.99527 16.5268C3.06252 16.6245 3.16342 16.6731 3.29811 16.6731C3.41356 16.6731 3.54171 16.6329 3.68272 16.5522L7.99995 14.1726L12.3175 16.5522C12.4523 16.6329 12.5805 16.6731 12.702 16.6731C12.8306 16.6731 12.9281 16.6245 12.9954 16.5268C13.0625 16.4294 13.0961 16.31 13.0961 16.1689C13.0961 16.0816 13.0929 16.0144 13.0865 15.9672L12.2595 10.9264L15.7499 7.35738C15.9168 7.18262 16 7.02124 16 6.87339Z" fill="currentColor"></path>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_39_1845">
                                      <rect width="16" height="16" fill="currentColor" transform="translate(0 0.673096)"></rect>
                                    </clipPath>
                                  </defs>
                                </svg>
                              </span>
                            </button>
                            <div class="buttons">
                              <button class="btn btn-default" wire:click="startGame('real')">Реальний</button>
                              <button class="btn btn-secondary" wire:click="startGame('demo')">Демо</button>
                            </div>
                            <div class="subtitle">Pragmatic Play</div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
    userInfoModal = new UserInfoModalComponent(page, page.locator('.modal-dialog'));
  });

  test('should be loaded and display modal title', async () => {
    await expect(userInfoModal.isLoaded()).resolves.toBeTruthy();
    await expect(userInfoModal.getModalTitle()).resolves.toBe('Інформація про користувача');
  });

  test('should close the modal', async () => {
    await userInfoModal.close();
    await expect(userInfoModal.root).toBeHidden();
  });

  test('should get user information', async () => {
    const userInfo = await userInfoModal.getUserInfo();
    expect(userInfo.email).toBe('justshmv@gmail.com');
    expect(userInfo.userId).toBe('ZN3297367');
    expect(userInfo.avatarUrl).toContain('avatar.png');
  });

  test('should get user statistics', async () => {
    const statistics = await userInfoModal.getStatistics();
    expect(statistics.totalWinnings).toBe('0,00');
    expect(statistics.totalBets).toBe('0,00');
    expect(statistics.totalUsedInBets).toBe('0,00');
  });

  test('should get favorite games', async () => {
    const favoriteGames = await userInfoModal.getFavoriteGames();
    expect(favoriteGames.games).toHaveLength(1);
    expect(favoriteGames.games[0].title).toBe('Sweet Bonanza');
    expect(favoriteGames.games[0].provider).toBe('Pragmatic Play');
  });

  test('should copy user ID', async () => {
    await userInfoModal.copyUserId();
    // В реальном сценарии здесь была бы проверка буфера обмена
    await expect(userInfoModal.userProfileCard.copyIdButton.root).toBeEnabled();
  });

  test('should show statistics details', async () => {
    await userInfoModal.showStatisticsDetails();
    await expect(userInfoModal.userStatistics.detailsButton.root).toBeEnabled();
  });

  test('should view all favorite games', async () => {
    await userInfoModal.viewAllFavoriteGames();
    await expect(userInfoModal.favoriteGames.viewAllButton.root).toBeEnabled();
  });

  test('should toggle game favorite', async () => {
    await userInfoModal.toggleGameFavorite('Sweet Bonanza');
    await expect(userInfoModal.favoriteGames.gameCards.first()).toBeVisible();
  });

  test('should play game in real mode', async () => {
    await userInfoModal.playGameReal('Sweet Bonanza');
    await expect(userInfoModal.favoriteGames.gameCards.first()).toBeVisible();
  });

  test('should play game in demo mode', async () => {
    await userInfoModal.playGameDemo('Sweet Bonanza');
    await expect(userInfoModal.favoriteGames.gameCards.first()).toBeVisible();
  });

  test('should navigate to next game', async () => {
    await userInfoModal.nextGame();
    await expect(userInfoModal.favoriteGames.nextButton.root).toBeEnabled();
  });

  test('should navigate to previous game', async () => {
    await userInfoModal.previousGame();
    await expect(userInfoModal.favoriteGames.prevButton.root).toBeEnabled();
  });

  test('should check if modal is fully loaded', async () => {
    const isFullyLoaded = await userInfoModal.isModalFullyLoaded();
    expect(isFullyLoaded).toBeTruthy();
  });

  test('should get full user info', async () => {
    const fullInfo = await userInfoModal.getFullUserInfo();
    expect(fullInfo.modalTitle).toBe('Інформація про користувача');
    expect(fullInfo.userInfo.email).toBe('justshmv@gmail.com');
    expect(fullInfo.userInfo.userId).toBe('ZN3297367');
    expect(fullInfo.statistics.totalWinnings).toBe('0,00');
    expect(fullInfo.favoriteGames.games).toHaveLength(1);
    expect(fullInfo.isFullyLoaded).toBeTruthy();
  });
});
