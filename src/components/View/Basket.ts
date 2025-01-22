import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { BasketModal } from './basketModal';

export class Basket {
    private products: IProduct[] = [];
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;
    private basketModal: BasketModal;

    constructor(basketButton: HTMLElement, basketCounter: HTMLElement, basketModal: BasketModal) {
        this.basketButton = basketButton;
        this.basketCounter = basketCounter;
        this.basketModal = basketModal;

        // Добавляем обработчик для кнопки корзины
        this.basketButton.addEventListener('click', () => {
            this.basketModal.openBasketModal(this.products, this.updateBasket.bind(this));
        });
    }

    // Получение списка товаров
    getProducts(): IProduct[] {
        return this.products;
    }

    // Проверка, есть ли продукт в корзине
    isProductInBasket(productId: string): boolean {
        return this.products.some((item) => item.id === productId);
    }

    // Добавление товара в корзину
    addProduct(product: IProduct, button: HTMLButtonElement): void {
        if (this.isProductInBasket(product.id)) {
            console.warn('Товар уже в корзине');
            return;
        }

        this.products.push(product);
        button.disabled = true; // Делаем кнопку неактивной
        button.textContent = 'В корзине';
        this.updateCounter();
    }

    // Удаление товара из корзины
    removeProduct(productId: string): void {
        this.products = this.products.filter((item) => item.id !== productId);
        this.updateCounter();
    }

    // Обновление отображения корзины
    updateBasket(): void {
        const basketList = document.querySelector('.basket__list') as HTMLElement;
        basketList.innerHTML = ''; // Очищаем текущий список

        const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

        this.products.forEach((product, index) => {
            const clone = basketTemplate.content.cloneNode(true) as HTMLElement;
            const itemIndex = clone.querySelector('.basket__item-index') as HTMLElement;
            const itemTitle = clone.querySelector('.card__title') as HTMLElement;
            const itemPrice = clone.querySelector('.card__price') as HTMLElement;
            const deleteButton = clone.querySelector('.basket__item-delete') as HTMLButtonElement;

            // Устанавливаем данные
            itemIndex.textContent = (index + 1).toString();
            itemTitle.textContent = product.title;
            itemPrice.textContent = `${product.price} синапсов`;

            // Обработчик для удаления товара
            deleteButton.addEventListener('click', () => {
                this.removeProduct(product.id);
                this.updateBasket();

                // Возвращаем кнопке "В корзину" активное состояние
                const productButton = document.querySelector(`.card__button[data-id="${product.id}"]`) as HTMLButtonElement;
                if (productButton) {
                    productButton.disabled = false;
                    productButton.textContent = 'В корзину';
                }
            });

            basketList.appendChild(clone);
        });
    }

    // Обновление счетчика корзины
    private updateCounter(): void {
        this.basketCounter.textContent = this.products.length.toString();
    }
}
