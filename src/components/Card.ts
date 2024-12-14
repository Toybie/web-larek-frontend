import { IProduct } from '../types/index';
import { Modal } from './modal';

const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export class Card {
    private modal: Modal;

    constructor(modal: Modal) {
        this.modal = modal;
    }

    renderProductModalContent(product: IProduct): HTMLElement {
        const container = document.createElement('div');
        container.classList.add('card', 'card_full');

        const isPriceValid = product.price !== null;

        container.innerHTML = `
            <img class="card__image" src="${CDN_URL}${product.image}" alt="${product.title}" />
            <div class="card__column">
                <span class="card__category card__category_soft">${product.category}</span>
                <h2 class="card__title">${product.title}</h2>
                <p class="card__text">${product.description || 'Описание товара отсутствует'}</p>
                <div class="card__row">
                    <button class="button" data-id="${product.id}" ${!isPriceValid ? 'disabled' : ''}>
                        ${!isPriceValid ? 'Недоступно' : 'В корзину'}
                    </button>
                    <span class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
                </div>
            </div>
        `;

        return container;
    }

    setupProductCard(card: HTMLElement, product: IProduct, addProductToBasket: (product: IProduct) => void): void {
        card.addEventListener('click', () => {
            const content = this.renderProductModalContent(product);
            this.modal.setContent(content);
            this.modal.open();

            const addToBasketButton = content.querySelector('.button') as HTMLButtonElement;
            if (addToBasketButton && product.price !== null) {
                addToBasketButton.addEventListener('click', () => addProductToBasket(product));
            }
        });
    }
}
