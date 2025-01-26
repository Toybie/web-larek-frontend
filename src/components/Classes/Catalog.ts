import { Api } from '../base/api';
import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { API_URL, CDN_URL } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/utils/constants';
import { Modal } from './Modal';
import { CardModal } from './cardModal';
import { Basket } from './Basket';

export class Catalog {
    private api: Api;
    private container: HTMLElement;
    private basket: Basket | null = null;
    private modal: Modal;

    constructor(container: HTMLElement, modal: Modal) {
        this.api = new Api(API_URL);
        this.container = container;
        this.modal = modal; 
    }

    // Установка корзины
    setBasket(basket: Basket): void {
        this.basket = basket;
    }

    // Загрузка продуктов с сервера
    async loadProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<IProduct>('/product');
            this.renderProducts(response.items);
            return response.items;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            this.container.innerHTML = 'Ошибка загрузки данных. Попробуйте позже.';
            return [];
        }
    }

    // Отрисовка карточек продуктов
    renderProducts(products: IProduct[]): void {
        const catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;

        if (!catalogTemplate) {
            console.error('Шаблон каталога не найден!');
            return;
        }

        const fragment = document.createDocumentFragment();

        products.forEach(product => {
            const clone = catalogTemplate.content.cloneNode(true) as HTMLElement;
            const cardImage = clone.querySelector('.card__image') as HTMLImageElement;
            const cardTitle = clone.querySelector('.card__title') as HTMLElement;
            const cardCategory = clone.querySelector('.card__category') as HTMLElement;
            const cardPrice = clone.querySelector('.card__price') as HTMLElement;
            const addToBasketButton = clone.querySelector('.card__button') as HTMLButtonElement;

            // Заполнение данных карточки
            cardImage.src = `${CDN_URL}/${product.image}`;
            cardImage.alt = product.title;
            cardTitle.textContent = product.title;
            cardCategory.textContent = product.category;
            cardPrice.textContent = `${product.price ? `${product.price} синапсов` : 'Бесценно'}`;

            // Открытие модального окна товара
            const card = clone.querySelector('.card') as HTMLElement;
            if (card) {
                card.addEventListener('click', () => {
                    const cardModal = new CardModal('.modal__content', this.basket!);
                    cardModal.setContent(product);
                    this.modal.open();
                });
            }

            fragment.appendChild(clone);
        });

        this.container.appendChild(fragment);
    }
}