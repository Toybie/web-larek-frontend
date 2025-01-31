import { IProduct } from '../../types';

export abstract class BaseBasket {
    protected basketList: HTMLElement | null = null;
    protected checkoutButton: HTMLButtonElement | null = null;

    constructor() {
        this.basketList = document.querySelector('.basket__list');
        this.checkoutButton = document.querySelector('.basket__button');
    }

    protected updateCheckoutButton(basket: IProduct[]): void {
        const checkoutButton = document.querySelector('.basket__button') as HTMLButtonElement;
    
        if (checkoutButton) {
            checkoutButton.disabled = basket.length === 0;
        }
    }

    protected renderTemplate(templateId: string, containerSelector: string): void {
        const container = document.querySelector(containerSelector) as HTMLElement;
        if (!container) {
            console.error(`Ошибка: элемент ${containerSelector} не найден.`);
            return;
        }
    
        const template = document.getElementById(templateId) as HTMLTemplateElement;
        if (!template) {
            console.error(`Ошибка: шаблон с ID "${templateId}" не найден.`);
            return;
        }
    
        container.innerHTML = '';
        const clone = template.content.cloneNode(true) as HTMLElement;
        container.appendChild(clone);
    }
}