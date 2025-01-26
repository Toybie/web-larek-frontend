import { Catalog } from './Catalog';
import { Modal } from './Modal';
import { BasketModal } from './basketModal';
import { Basket } from './Basket';
import { CardModal } from './cardModal';

class App {
    private catalog: Catalog;
    private basket: Basket;
    private modal: Modal;
    private basketModal: BasketModal;
    private cardModal: CardModal;

    constructor() {
        // Инициализация модального окна
        this.modal = new Modal('.modal');

        // Инициализация корзины
        const basketButton = document.querySelector('.header__basket') as HTMLElement;
        const basketCounter = document.querySelector('.header__basket-count') as HTMLElement;

        // Создаем экземпляр Basket с временным значением null для basketModal
        this.basket = new Basket(basketButton, basketCounter, null);

        // Создаем экземпляр BasketModal и передаем туда модальное окно и корзину
        this.basketModal = new BasketModal(this.modal, this.basket);

        // Обновляем basketModal в корзине
        this.basket.setBasketModal(this.basketModal);

        // Инициализация модального окна карточки товара
        this.cardModal = new CardModal('.modal__content', this.basket);

        // Инициализация каталога
        const catalogContainer = document.querySelector('.gallery') as HTMLElement;
        this.catalog = new Catalog(catalogContainer, this.modal);

        // Загрузка товаров
        this.catalog.loadProducts();

        // Настройка обработчиков событий
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Обработчик для закрытия модального окна
        const closeButton = document.querySelector('.modal__close') as HTMLElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.modal.close();
            });
        }
    }
}

// Запуск приложения
new App();