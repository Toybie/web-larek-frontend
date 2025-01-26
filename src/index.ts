import './scss/styles.scss';
import { Catalog } from './components/Classes/Catalog';
import { Modal } from './components/Classes/Modal';
import { BasketModal } from './components/Classes/basketModal';
import { Basket } from './components/Classes/Basket';
import { IProduct } from './types';

// Инициализация модального окна
const modal = new Modal('.modal'); // Создаем только один экземпляр

// Создаем кнопки и счетчик корзины
const basketButton = document.querySelector('.header__basket') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

// Инициализация контейнера для каталога товаров
const catalogContainer = document.querySelector('.gallery') as HTMLElement;

// Создаем экземпляр каталога и передаем контейнер и экземпляр Modal
const catalog = new Catalog(catalogContainer, modal);

// Загружаем товары
catalog.loadProducts().then((products: IProduct[]) => {
    // Создаем экземпляр корзины
    const basket = new Basket(basketButton, basketCounter, null);

    // Создаем экземпляр BasketModal и передаем туда модальное окно и корзину
    const basketModal = new BasketModal(modal, basket);

    // Обновляем basketModal в корзине
    basket.setBasketModal(basketModal);

    // Передаем корзину в каталог
    catalog.setBasket(basket);
});

// Добавление слушателя событий на закрытие окна
const closeButton = document.querySelector('.modal__close') as HTMLElement;
if (closeButton) {
    closeButton.addEventListener('click', () => {
        modal.close();
    });
}