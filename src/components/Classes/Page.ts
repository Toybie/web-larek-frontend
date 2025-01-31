export class Page {
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;
    private catalogContainer: HTMLElement;

    constructor() {
        this.basketButton = document.querySelector('.header__basket') as HTMLElement;
        this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
        this.catalogContainer = document.querySelector('.gallery') as HTMLElement;

        if (!this.basketButton || !this.basketCounter || !this.catalogContainer) {
            throw new Error('Не удалось найти необходимые элементы на странице.');
        }
    }

    getBasketButton(): HTMLElement {
        return this.basketButton;
    }

    getBasketCounter(): HTMLElement {
        return this.basketCounter;
    }

    getCatalogContainer(): HTMLElement {
        return this.catalogContainer;
    }

    addBasketButtonClickHandler(handler: () => void): void {
        this.basketButton.addEventListener('click', handler);
    }
}