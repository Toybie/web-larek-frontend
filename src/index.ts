import './scss/styles.scss';
import { Catalog } from './components/View/Catalog';
import { Modal } from './components/View/Modal';
import { BasketModal } from './components/View/basketModal';
import { Basket } from './components/View/Basket';

// Инициализация модального окна
const modal = new Modal('.modal'); // Создаем только один экземпляр

// Создаем экземпляр корзины и передаем туда модальное окно
const basketModal = new BasketModal(modal);

// Создаем кнопки и счетчик корзины
const basketButton = document.querySelector('.header__basket') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

// Создаем экземпляр корзины
const basket = new Basket(basketButton, basketCounter, basketModal);

// Инициализация контейнера для каталога товаров
const catalogContainer = document.querySelector('.gallery') as HTMLElement;

// Создаем экземпляр каталога, передаем только контейнер и корзину
const catalog = new Catalog(catalogContainer, basket);

// Загружаем товары
catalog.loadProducts();

// Добавление слушателя событий на закрытие окна
const closeButton = document.querySelector('.modal__close') as HTMLElement;
if (closeButton) {
  closeButton.addEventListener('click', () => {
    modal.close();
  });
}
