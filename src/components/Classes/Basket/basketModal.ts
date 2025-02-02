import { Modal } from '../Modal';
import { OrderForm } from '../Order/OrderForm';
import { Basket } from './Basket';
import { BaseBasket } from './BaseBasket';
import { IProduct } from '../../../types';

export class BasketModal extends BaseBasket {
    private modal: Modal;
    private orderForm: OrderForm;
    private basket: Basket;

    constructor(modal: Modal, basket: Basket) {
        super();
        this.modal = modal;
        this.basket = basket;
        this.orderForm = new OrderForm('.modal__content', basket, modal);
    }

    /**
     * Рендеринг товаров в корзине.
     */
    private renderBasketItems(basket: IProduct[]): void {
        const basketList = document.querySelector('.basket__list') as HTMLElement;
        if (!basketList) {
            console.error('Список товаров корзины не найден.');
            return;
        }

        basketList.innerHTML = ''; // Очищаем список перед рендерингом

        basket.forEach((product, index) => {
            const item = document.createElement('li');
            item.className = 'basket__item card card_compact';
            item.innerHTML = `
                <span class="basket__item-index">${index + 1}</span>
                <span class="card__title">${product.title}</span>
                <span class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
                <button class="basket__item-delete card__button" aria-label="удалить"></button>
            `;

            const deleteButton = item.querySelector('.basket__item-delete') as HTMLButtonElement;
            deleteButton.addEventListener('click', () => {
                this.basket.removeProduct(product.id);
                this.updateBasketUI(); // Обновляем UI после удаления товара
            });

            basketList.appendChild(item);
        });
    }

    /**
     * Открывает модальное окно корзины.
     */
    openBasketModal(): void {
        this.modal.open();
        this.renderTemplate('basket', '.modal__content');

        try {
            this.updateBasketUI(); // Вызываем обновление UI
        } catch (error) {
            console.error('Ошибка при обновлении корзины:', error);
        }
    }

    /**
     * Обновляет интерфейс корзины (товары, кнопки, цена).
     */
    private updateBasketUI(): void {
        const basket = this.basket.getProductsInBasket();

        this.renderBasketItems(basket); // Рендерим товары
        this.updateTotalPrice(basket); // Обновляем общую цену
        this.updateCheckoutButton(basket); // Обновляем кнопку оформления заказа
    }

    /**
     * Обновляет общую цену корзины.
     */
    private updateTotalPrice(basket: IProduct[]): void {
        const totalPriceElement = document.querySelector('.basket__price') as HTMLElement;
        if (!totalPriceElement) {
            console.error('Элемент для отображения общей цены не найден.');
            return;
        }

        const totalPrice = basket.reduce((sum, product) => sum + (product.price || 0), 0);
        totalPriceElement.textContent = `${totalPrice} синапсов`;
    }

    /**
     * Обновляет состояние кнопки оформления заказа.
     */
    protected updateCheckoutButton(basket: IProduct[]): void {
        const checkoutButton = document.querySelector('.basket__button') as HTMLButtonElement;
        if (checkoutButton) {
            checkoutButton.disabled = basket.length === 0; // Кнопка активна, если в корзине есть товары
            checkoutButton.addEventListener('click', () => {
                this.orderForm.renderForm();
            });
        }
    }
}