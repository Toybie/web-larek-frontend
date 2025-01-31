import { IProduct } from '../../../types';
import { saveBasketToLocalStorage, loadBasketFromLocalStorage } from '../localStorage';
import { BaseBasket } from '../Basket/BaseBasket';
import { Page } from '../Gallery/Page';

export class Basket extends BaseBasket {
    private products: IProduct[] = [];
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;
    private basketModal: any;

    constructor(basketButton: HTMLElement, page: Page, basketModal: any) {
        super();
        this.basketButton = basketButton;
        this.basketCounter = page.getBasketCounter();
        this.products = loadBasketFromLocalStorage();
        this.updateCounter();
        this.updateCheckoutButton(this.products);
    }

    setBasketModal(basketModal: any): void {
        this.basketModal = basketModal;
    }

    addProduct(product: IProduct): void {
        if (!this.isProductInBasket(product.id)) {
            this.products.push(product);
            this.updateBasket();
        }
    }

    removeProduct(productId: string): void {
        this.products = this.products.filter((item) => item.id !== productId);
        this.updateBasket();
    }

    getProductsInBasket(): IProduct[] {
        return this.products;
    }

    isProductInBasket(productId: string): boolean {
        return this.products.some((item) => item.id === productId);
    }

    clearBasket(): void {
        this.products = [];
        this.updateBasket();
    }

    updateBasket(): void {
        this.updateCounter();
        this.updateCheckoutButton(this.products);
        saveBasketToLocalStorage(this.products);
    }

    private updateCounter(): void {
        if (this.basketCounter) {
            this.basketCounter.textContent = this.products.length.toString();
        }
    }
}