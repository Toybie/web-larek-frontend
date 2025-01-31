import { IProduct } from '../../../types';
import { CDN_URL } from '../../../utils/constants';
import { Basket } from '../Basket/Basket';

export class CardModal {
    private modalContent: HTMLElement;
    private basket: Basket;

    constructor(modalContentSelector: string, basket: Basket) {
        this.modalContent = document.querySelector(modalContentSelector) as HTMLElement;
        this.basket = basket;
    }

    setContent(product: IProduct): void {
        const container = document.createElement('div');
        container.classList.add('card', 'card_full');
        const isPriceValid = product.price !== null;

        const isInBasket = this.basket.isProductInBasket(product.id);

        container.innerHTML = `
            <img class="card__image" src="${CDN_URL}/${product.image}" alt="${product.title}" />
            <div class="card__column">
                <span class="card__category card__category_soft">${product.category}</span>
                <h2 class="card__title">${product.title}</h2>
                <p class="card__text">${product.description || 'Описание товара отсутствует'}</p>
                <div class="card__row">
                    <button class="button" data-id="${product.id}" ${!isPriceValid || isInBasket ? 'disabled' : ''}>
                        ${!isPriceValid ? 'Недоступно' : isInBasket ? 'Товар в корзине' : 'В корзину'}
                    </button>
                    <span class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
                </div>
            </div>
        `;

        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(container);

        this.addAddToCartListener(product);
    }

    private addAddToCartListener(product: IProduct): void {
        const addToCartButton = this.modalContent.querySelector('.button') as HTMLButtonElement;

        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                this.basket.addProduct(product);
                addToCartButton.disabled = true;
                addToCartButton.textContent = 'Добавлено';
            });
        }
    }
}