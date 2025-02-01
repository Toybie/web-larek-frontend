import { Modal } from '../Modal';
import { Basket } from '../Basket/Basket';
import { ProductRenderer } from './ProductRenderer';
import { CardModal } from '../Card/cardModal';
import { ProductLoader } from './ProductLoader';
import { IProduct } from '../../../types';

export class Catalog {
    private container: HTMLElement;
    private modal: Modal;
    private basket: Basket | null = null;
    private productLoader: ProductLoader;
    private productRenderer: ProductRenderer;

    constructor(container: HTMLElement, modal: Modal) {
        this.container = container;
        this.modal = modal;
        this.productLoader = new ProductLoader();
        this.productRenderer = new ProductRenderer(container);

        this.container.addEventListener('product:selected', (event: Event) => {
            const customEvent = event as CustomEvent;
            const product = customEvent.detail.product;

            if (!this.basket) {
                console.error('Корзина не инициализирована.');
                return;
            }

            const cardModal = new CardModal('.modal__content', this.basket);
            cardModal.setContent(product);
            this.modal.open();
        });
    }

    setBasket(basket: Basket): void {
        this.basket = basket;
    }

    async loadAndRenderProducts(): Promise<void> {
        try {
            const products = await this.productLoader.loadProducts();
            this.productRenderer.render(products);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            this.container.innerHTML = 'Ошибка загрузки данных. Попробуйте позже.';
        }
    }
}