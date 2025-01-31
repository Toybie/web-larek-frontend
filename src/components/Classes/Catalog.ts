import { Modal } from './Modal';
import { Basket } from './Basket';
import { ProductService } from './ProductService';
import { ProductRenderer } from './ProductRenderer';
import { CardModal } from './cardModal';
import { IProduct } from '../../types';

export class Catalog {
    private container: HTMLElement;
    private modal: Modal;
    private basket: Basket | null = null;
    private productService: ProductService;
    private productRenderer: ProductRenderer;

    constructor(container: HTMLElement, modal: Modal) {
        this.container = container;
        this.modal = modal;
        this.productService = new ProductService();
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

    async loadProducts(): Promise<IProduct[]> {
        try {
            return await this.productService.fetchProducts();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            throw error;
        }
    }

    async loadAndRenderProducts(): Promise<void> {
        try {
            const products = await this.loadProducts();
            this.productRenderer.render(products);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            this.container.innerHTML = 'Ошибка загрузки данных. Попробуйте позже.';
        }
    }
}