import './scss/styles.scss';
import { Modal } from './components/Classes/Modal';
import { Catalog } from './components/Classes/Catalog';
import { BasketModal } from './components/Classes/basketModal';
import { Basket } from './components/Classes/Basket';
import { Page } from './components/Classes/Page';

// Инициализация страницы
const page = new Page();

// Инициализация модального окна
const modal = new Modal('.modal');

// Инициализация каталога
const catalog = new Catalog(page.getCatalogContainer(), modal);

// Инициализация корзины
const basket = new Basket(page.getBasketButton(), page, null);

// Передаем корзину в каталог
catalog.setBasket(basket);

// Инициализация модального окна корзины
const basketModal = new BasketModal(modal, basket);

// Обновляем basketModal в корзине
basket.setBasketModal(basketModal);

// Загружаем товары
catalog.loadAndRenderProducts();

// Добавляем обработчик клика на кнопку корзины
page.addBasketButtonClickHandler(() => {
    basketModal.openBasketModal(basket.getProductsInBasket(), basket.updateBasket.bind(basket));
});