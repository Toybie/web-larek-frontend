// localStorage.ts
import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';

// Сохранение корзины в localStorage
export function saveBasketToLocalStorage(products: IProduct[]): void {
    localStorage.setItem('basket', JSON.stringify(products));
}

// Загрузка корзины из localStorage
export function loadBasketFromLocalStorage(): IProduct[] | null {
    const storedBasket = localStorage.getItem('basket');
    return storedBasket ? JSON.parse(storedBasket) : null;
}
