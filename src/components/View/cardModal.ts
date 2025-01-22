import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { CDN_URL } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/utils/constants';

export class CardModal {
    private modalContent: HTMLElement;

    constructor(modalContentSelector: string) {
        this.modalContent = document.querySelector(modalContentSelector) as HTMLElement;
    }

    // Метод для установки контента в модальное окно
    setContent(product: IProduct): void {
        const container = document.createElement('div');
        container.classList.add('card', 'card_full');
        const isPriceValid = product.price !== null;

        container.innerHTML = `
            <img class="card__image" src="${CDN_URL}/${product.image}" alt="${product.title}" />
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
        
        this.modalContent.innerHTML = ''; // Очищаем предыдущий контент
        this.modalContent.appendChild(container);

        this.addAddToCartListener(product);
    }

    // Метод для добавления обработчика на кнопку "В корзину"
    private addAddToCartListener(product: IProduct): void {
        const addToCartButton = this.modalContent.querySelector('.button') as HTMLElement;
        
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                this.addToCart(product);
            });
        }
    }

    // Метод для добавления товара в корзину (логика будет определяться позже)
    private addToCart(product: IProduct): void {
        console.log('Добавлен товар в корзину:', product.title);
        // Логика добавления в корзину (можно работать с корзиной, хранить товары в localStorage и т.д.)
    }
}
