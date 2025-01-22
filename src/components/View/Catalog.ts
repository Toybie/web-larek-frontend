import { Api } from '../base/api';
import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { API_URL, CDN_URL } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/utils/constants';
import { Modal } from './Modal';

export class Catalog {
    private api: Api;
    private container: HTMLElement;
    private modal: Modal;

    constructor(container: HTMLElement) {
        this.api = new Api(API_URL);
        this.container = container;

        this.modal = new Modal('.modal'); 
    }

    // Метод для получения данных товаров с сервера
    loadProducts(): void {
        this.api.get<IProduct>('/product')
            .then(response => {
                this.renderProducts(response.items);
            })
            .catch((error) => {
                console.error('Ошибка при загрузке данных:', error);
                this.container.innerHTML = 'Ошибка загрузки данных. Попробуйте позже.';
            });
    }

    // Метод для отрисовки карточек товаров
    renderProducts(products: IProduct[]): void {
        const catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
        const fragment = document.createDocumentFragment();
    
        products.forEach(product => {
            const clone = catalogTemplate.content.cloneNode(true) as HTMLElement;
            const cardImage = clone.querySelector('.card__image') as HTMLImageElement;
            const cardTitle = clone.querySelector('.card__title') as HTMLElement;
            const cardCategory = clone.querySelector('.card__category') as HTMLElement;
            const cardPrice = clone.querySelector('.card__price') as HTMLElement;
    
            // Устанавливаем данные в карточку
            cardImage.src = `${CDN_URL}/${product.image}`;
            cardImage.alt = product.title;
            cardTitle.textContent = product.title;
            cardCategory.textContent = product.category;
            cardPrice.textContent = `${product.price ? `${product.price} синапсов` : 'Бесценно'}`;
    
            const card = clone.querySelector('.card') as HTMLElement;
            if (card) {
                console.log('Добавлен обработчик на карточку: ', product.title);
                card.addEventListener('click', () => {
                    const content = this.renderProductModalContent(product);
                    this.modal.setContent(content);
                    this.modal.open();
                });
            }
    
            fragment.appendChild(clone);
        });
    
        this.container.appendChild(fragment);
    }

    // Метод для отрисовки контента для модального окна
    renderProductModalContent(product: IProduct): HTMLElement {
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

        return container;
    }
}
