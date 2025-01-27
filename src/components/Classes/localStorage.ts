import { IProduct } from '../../types';

// Сохранение корзины в localStorage
export function saveBasketToLocalStorage(products: IProduct[]): void {
    localStorage.setItem('basket', JSON.stringify(products));
}

// Загрузка корзины из localStorage
export function loadBasketFromLocalStorage(): IProduct[] {
    const storedBasket = localStorage.getItem('basket');
    return storedBasket ? JSON.parse(storedBasket) : [];
}