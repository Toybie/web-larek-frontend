import { IProduct } from '../types/index';

export class Basket {
    private basket: IProduct[] = [];
    private addedProductIds = new Set<string>();
    private basketCounter: HTMLElement;

    constructor(basketCounterSelector: string) {
        this.basketCounter = document.querySelector(basketCounterSelector) as HTMLElement;
    }

    loadBasket(): void {
        const storedBasket = localStorage.getItem('basket');
        if (storedBasket) {
            this.basket = JSON.parse(storedBasket);
        }

        const storedIds = localStorage.getItem('addedProductIds');
        if (storedIds) {
            this.addedProductIds = new Set<string>(JSON.parse(storedIds));
        }

        this.updateBasketCounter();
    }

    saveBasket(): void {
        localStorage.setItem('basket', JSON.stringify(this.basket));
        localStorage.setItem('addedProductIds', JSON.stringify([...this.addedProductIds]));
    }

    addProduct(product: IProduct): void {
        if (this.addedProductIds.has(product.id)) return;

        this.basket.push(product);
        this.addedProductIds.add(product.id);
        this.saveBasket();
        this.updateBasketCounter();
    }

    removeProduct(productId: string): void {
        this.basket = this.basket.filter((product) => product.id !== productId);
        this.addedProductIds.delete(productId);
        this.saveBasket();
        this.updateBasketCounter();
    }

    updateBasketCounter(): void {
        this.basketCounter.textContent = this.basket.length.toString();
    }
}
