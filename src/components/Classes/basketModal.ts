import { Modal } from './Modal';
import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { OrderForm } from './OrderForm';
import { Basket } from './Basket';

export class BasketModal {
    private modal: Modal;
    private orderForm: OrderForm;

    constructor(modal: Modal, basket: Basket) {
        this.modal = modal;
        this.orderForm = new OrderForm('.modal__content', basket, modal);
    }

    // Открытие модального окна корзины
    openBasketModal(basket: IProduct[] = [], updateBasket: (basket: IProduct[]) => void) {
        if (!Array.isArray(basket)) {
            console.error('Ошибка: передана некорректная корзина. Ожидается массив.');
            return;
        }

        this.modal.open();

        const modalContent = document.querySelector('.modal__content') as HTMLElement;
        if (!modalContent) {
            console.error('Ошибка: элемент .modal__content не найден.');
            return;
        }

        modalContent.innerHTML = '';

        const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        if (!basketTemplate) {
            console.error('Ошибка: шаблон корзины с ID "basket" не найден.');
            return;
        }

        const modalClone = basketTemplate.content.cloneNode(true) as HTMLElement;
        modalContent.appendChild(modalClone);

        try {
            updateBasket(basket);
        } catch (error) {
            console.error('Ошибка при обновлении корзины:', error);
        }

        // Находим кнопку "Оформить" и добавляем обработчик
        const checkoutButton = modalContent.querySelector('.basket__button') as HTMLButtonElement;
        if (checkoutButton) {
            checkoutButton.disabled = basket.length === 0;
            checkoutButton.addEventListener('click', () => {
                this.orderForm.renderForm();
            });
        } else {
            console.warn('Кнопка "Оформить" не найдена!');
        }
    }
}