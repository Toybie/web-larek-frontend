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

    private renderBasketItems(basket: IProduct[]): void {
        const basketList = document.querySelector('.basket__list') as HTMLElement;

        if (!basketList) {
            console.error('Список товаров корзины не найден.');
            return;
        }

        basketList.innerHTML = '';

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
                this.openBasketModal(this.basket.getProductsInBasket(), this.basket.updateBasket.bind(this)); 
            });

            basketList.appendChild(item);
        });
    }

    openBasketModal(basket: IProduct[] = [], updateBasket: (basket: IProduct[]) => void): void {
        if (!Array.isArray(basket)) {
            console.error('Ошибка: передана некорректная корзина. Ожидается массив.');
            return;
        }
    
        this.modal.open();
        this.renderTemplate('basket', '.modal__content');
    
        try {
            updateBasket(basket);
        } catch (error) {
            console.error('Ошибка при обновлении корзины:', error);
        }
    
        this.updateCheckoutButton(basket);
        this.renderBasketItems(basket);
        this.updateTotalPrice(basket);
    
        const checkoutButton = document.querySelector('.basket__button') as HTMLButtonElement;
    
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                this.orderForm.renderForm();
            });
        } 
    }

    private updateTotalPrice(basket: IProduct[]): void {
        const totalPriceElement = document.querySelector('.basket__price') as HTMLElement;
    
        const totalPrice = basket.reduce((sum, product) => sum + (product.price || 0), 0);
        totalPriceElement.textContent = `${totalPrice} синапсов`;
    }
}